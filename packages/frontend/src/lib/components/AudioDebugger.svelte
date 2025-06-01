<script lang="ts">
  import { onMount } from 'svelte';
  import { audioEngineStore } from '$lib/stores/audioEngineStore';
  import { projectStore } from '$lib/stores/projectStore';
  import { loadAudioFromUrl } from '$lib/utils/audioService';

  let canvas: HTMLCanvasElement;
  let audioLoaded = false;
  let loadError = '';
  let isLoading = false;

  $: audioState = $audioEngineStore;
  $: projectState = $projectStore;

  onMount(() => {
    console.log("AudioDebugger mounted, canvas:", canvas);
    if (canvas) {
      try {
        const ctx = canvas.getContext('2d');
        console.log("Canvas context obtained:", ctx);
        if (ctx) {
          console.log("Drawing test pattern...");
          drawTestPattern(ctx);
        } else {
          console.error("Failed to get 2D context from canvas");
        }
      } catch (error) {
        console.error("Error setting up canvas:", error);
      }
      
      // Force a redraw after a short delay
      setTimeout(() => {
        try {
          console.log("Forcing redraw...");
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawTestPattern(ctx);
          }
        } catch (error) {
          console.error("Error in forced redraw:", error);
        }
      }, 500);
    } else {
      console.error("Canvas element not available");
    }
  });

  function drawTestPattern(ctx: CanvasRenderingContext2D) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw colorful test pattern
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 50, 50);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(canvas.width - 50, 0, 50, 50);
    
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(0, canvas.height - 50, 50, 50);
    
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(canvas.width - 50, canvas.height - 50, 50, 50);
    
    // Draw test grid
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw test sine wave
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const centerY = canvas.height / 2;
    const amplitude = canvas.height * 0.25;
    
    for (let x = 0; x < canvas.width; x++) {
      const y = centerY + Math.sin(x * 0.05) * amplitude;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
  }

  async function reloadAudio() {
    if (!projectState.masterAudioInfo?.backendPath) {
      loadError = "No audio file path available";
      return;
    }

    try {
      isLoading = true;
      loadError = "";
      console.log("Manual reloading audio from:", projectState.masterAudioInfo.backendPath);
      await loadAudioFromUrl(projectState.masterAudioInfo.backendPath);
      console.log("Audio loaded successfully");
      audioLoaded = true;
      isLoading = false;
    } catch (error) {
      console.error("Failed to load audio:", error);
      loadError = error.message || "Failed to load audio";
      isLoading = false;
    }
  }
</script>

<div class="audio-debugger">
  <h2>Audio Debugger</h2>
  
  <div class="debug-info">
    <h3>Audio Engine State</h3>
    <ul>
      <li>Audio Buffer: {audioState.audioBuffer ? 'Present' : 'Missing'}</li>
      <li>Audio Buffer Length: {audioState.audioBuffer?.length ?? 'N/A'}</li>
      <li>Duration: {audioState.totalDuration?.toFixed(2) ?? 'N/A'} seconds</li>
      <li>Channels: {audioState.audioBuffer?.numberOfChannels ?? 'N/A'}</li>
      <li>Current Time: {audioState.currentTime?.toFixed(2) ?? 'N/A'}</li>
      <li>Is Playing: {audioState.isPlaying ? 'Yes' : 'No'}</li>
    </ul>
    
    <h3>Project State</h3>
    <ul>
      <li>Master Audio Info: {projectState.masterAudioInfo ? 'Present' : 'Missing'}</li>
      <li>Backend Path: {projectState.masterAudioInfo?.backendPath ?? 'N/A'}</li>
    </ul>
  </div>
  
  <div class="canvas-container">
    <h3>Canvas Test</h3>
    <canvas 
      bind:this={canvas} 
      width="600" 
      height="200"
      class="debug-canvas"
    ></canvas>
  </div>
  
  <div class="debug-controls">
    <button on:click={reloadAudio} disabled={isLoading}>
      {#if isLoading}
        Loading...
      {:else}
        Reload Audio
      {/if}
    </button>
    
    {#if loadError}
      <div class="error-message">Error: {loadError}</div>
    {/if}
    
    {#if audioLoaded}
      <div class="success-message">Audio loaded successfully!</div>
    {/if}
  </div>
</div>

<style>
  .audio-debugger {
    background-color: #222;
    color: #eee;
    padding: 20px;
    border-radius: 8px;
    border: 2px solid #444;
    font-family: monospace;
    margin: 20px;
  }
  
  h2 {
    color: #00ff88;
    margin-top: 0;
    border-bottom: 1px solid #444;
    padding-bottom: 10px;
  }
  
  h3 {
    color: #00d4ff;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  
  .debug-info {
    background-color: #333;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  li {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
  }
  
  .canvas-container {
    margin-bottom: 20px;
  }
  
  .debug-canvas {
    background-color: #111;
    border: 1px solid #666;
    width: 100%;
    max-width: 600px;
    height: 200px;
    display: block;
  }
  
  .debug-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  button {
    background-color: #00ff88;
    color: #222;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    align-self: flex-start;
  }
  
  button:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #ff5555;
    background-color: rgba(255, 85, 85, 0.2);
    padding: 10px;
    border-radius: 5px;
    border-left: 3px solid #ff5555;
  }
  
  .success-message {
    color: #00ff88;
    background-color: rgba(0, 255, 136, 0.2);
    padding: 10px;
    border-radius: 5px;
    border-left: 3px solid #00ff88;
  }
</style>