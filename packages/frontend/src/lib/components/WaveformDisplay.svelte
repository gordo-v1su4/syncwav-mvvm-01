<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { audioEngineStore } from '$lib/stores/audioEngineStore';
  import { generateWaveformPeaks, timeToPixel, pixelToTime, calculateSamplesPerPixel, formatTime } from '$lib/utils/audioUtils';
  import type { AudioPeakData, AudioMarker } from '$lib/types';
  // import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'svelte-lucide';

  // Props
  export let audioBuffer: AudioBuffer | null = null;
  export let width = 800;
  export let height = 120;

  // Internal state
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let peaks: AudioPeakData[] = [];
  let zoom = 1.0;
  let scrollOffset = 0;
  let isScrolling = false;
  let isDragging = false;

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    seek: { time: number };
    markerSelect: { marker: AudioMarker };
    markerMove: { marker: AudioMarker; newTime: number };
  }>();

  // Subscribe to audio engine state
  $: currentTime = $audioEngineStore.currentTime;
  $: totalDuration = $audioEngineStore.totalDuration;
  $: markers = $audioEngineStore.markers;
  $: isPlaying = $audioEngineStore.isPlaying;

  // Reactive zoom and scroll bounds
  $: maxScrollOffset = Math.max(0, totalDuration - (totalDuration / zoom));
  $: scrollOffset = Math.max(0, Math.min(scrollOffset, maxScrollOffset));

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d')!;
      setupCanvas();
      render();
    }
  });

  // Regenerate peaks when audio buffer changes
  $: if (audioBuffer && canvas) {
    generatePeaks();
    render();
  }

// Re-render when any visual input changes
$: {
  // Explicitly reference deps so Svelte tracks them
  void currentTime; void markers; void zoom; void scrollOffset;
  if (ctx && peaks.length > 0) render();
}

  function setupCanvas() {
    if (!canvas || !ctx) return;
    
    // Set up high-DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }

  function generatePeaks() {
    if (!audioBuffer) return;
    
    const canvasWidth = canvas ? canvas.clientWidth : width;
    const samplesPerPixel = calculateSamplesPerPixel(audioBuffer, canvasWidth, zoom);
    peaks = generateWaveformPeaks(audioBuffer, samplesPerPixel);
  }

  function render() {
    if (!ctx || !audioBuffer || peaks.length === 0) return;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw waveform
    drawWaveform(canvasWidth, canvasHeight);
    
    // Draw markers
    drawMarkers(canvasWidth, canvasHeight);
    
    // Draw playhead
    drawPlayhead(canvasWidth, canvasHeight);
    
    // Draw time ruler
    drawTimeRuler(canvasWidth, canvasHeight);
  }

  function drawWaveform(canvasWidth: number, canvasHeight: number) {
    if (!ctx || peaks.length === 0) return;

    const centerY = canvasHeight / 2;
    const maxAmplitude = canvasHeight * 0.35; // Leave space for time ruler

    ctx.strokeStyle = '#b0b0b0';
    ctx.lineWidth = 1;
    ctx.beginPath();

    const visibleDuration = totalDuration / zoom;
    const startTime = scrollOffset;
    const endTime = startTime + visibleDuration;

    const startPeakIndex = Math.floor((startTime / totalDuration) * peaks.length);
    const endPeakIndex = Math.ceil((endTime / totalDuration) * peaks.length);

    for (let i = startPeakIndex; i < endPeakIndex && i < peaks.length; i++) {
      const peak = peaks[i];
      const peakTime = (i / peaks.length) * totalDuration;
      const x = timeToPixel(peakTime, totalDuration, canvasWidth, zoom, scrollOffset);
      
      if (x >= 0 && x <= canvasWidth) {
        const yMax = centerY - (peak.max * maxAmplitude);
        const yMin = centerY - (peak.min * maxAmplitude);
        
        ctx.moveTo(x, yMax);
        ctx.lineTo(x, yMin);
      }
    }

    ctx.stroke();
  }

  function drawMarkers(canvasWidth: number, canvasHeight: number) {
    if (!ctx) return;

    markers.forEach(marker => {
      const x = timeToPixel(marker.time, totalDuration, canvasWidth, zoom, scrollOffset);
      
      if (x >= 0 && x <= canvasWidth) {
        drawMarker(marker, x, canvasHeight);
      }
    });
  }

  function drawMarker(marker: AudioMarker, x: number, canvasHeight: number) {
    if (!ctx) return;

    const colors = {
      beat: '#00ff88',      // neon-accent-1
      transient: '#ff6b35', // neon-accent-2
      user: '#00d4ff',      // neon-accent-3
      stem: '#ffaa3d'       // neon-accent-warm
    };

    ctx.strokeStyle = marker.color || colors[marker.type] || colors.user;
    ctx.lineWidth = marker.type === 'beat' ? 2 : 1;
    ctx.setLineDash(marker.type === 'user' ? [5, 5] : []);

    // Draw vertical line
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x, canvasHeight - 30);
    ctx.stroke();

    // Draw marker shape at top
    ctx.fillStyle = ctx.strokeStyle;
    ctx.setLineDash([]);
    
    if (marker.type === 'transient') {
      // Diamond shape for transients
      ctx.beginPath();
      ctx.moveTo(x, 10);
      ctx.lineTo(x + 4, 15);
      ctx.lineTo(x, 20);
      ctx.lineTo(x - 4, 15);
      ctx.closePath();
      ctx.fill();
    } else {
      // Circle for beats and user markers
      ctx.beginPath();
      ctx.arc(x, 15, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw label if present
    if (marker.label) {
      ctx.fillStyle = '#f0f0f0';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(marker.label, x, canvasHeight - 15);
    }
  }

  function drawPlayhead(canvasWidth: number, canvasHeight: number) {
    if (!ctx) return;

    const x = timeToPixel(currentTime, totalDuration, canvasWidth, zoom, scrollOffset);
    
    if (x >= 0 && x <= canvasWidth) {
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);

      // Draw playhead line
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();

      // Draw playhead triangle at top
      ctx.fillStyle = '#00ff88';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - 5, 10);
      ctx.lineTo(x + 5, 10);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawTimeRuler(canvasWidth: number, canvasHeight: number) {
    if (!ctx) return;

    const visibleDuration = totalDuration / zoom;
    const startTime = scrollOffset;
    
    // Calculate appropriate time interval based on zoom
    let interval = 1; // seconds
    if (visibleDuration > 60) interval = 10;
    else if (visibleDuration > 30) interval = 5;
    else if (visibleDuration > 10) interval = 2;

    ctx.fillStyle = '#808080';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    const startInterval = Math.ceil(startTime / interval) * interval;
    const endTime = startTime + visibleDuration;

    for (let time = startInterval; time <= endTime; time += interval) {
      const x = timeToPixel(time, totalDuration, canvasWidth, zoom, scrollOffset);
      
      if (x >= 0 && x <= canvasWidth) {
        // Draw tick mark
        ctx.strokeStyle = '#404040';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, canvasHeight - 25);
        ctx.lineTo(x, canvasHeight - 20);
        ctx.stroke();

        // Draw time label
        ctx.fillText(formatTime(time), x, canvasHeight - 5);
      }
    }
  }

  function handleCanvasClick(event: MouseEvent) {
    if (!audioBuffer) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickTime = pixelToTime(x, totalDuration, canvas.clientWidth, zoom, scrollOffset);
    
    dispatch('seek', { time: clickTime });
  }

  function handleZoomIn() {
    zoom = Math.min(10, zoom * 1.5);
    generatePeaks();
    render();
  }

  function handleZoomOut() {
    zoom = Math.max(0.1, zoom / 1.5);
    generatePeaks();
    render();
  }

  function handleScrollLeft() {
    scrollOffset = Math.max(0, scrollOffset - (totalDuration / zoom) * 0.1);
    render();
  }

  function handleScrollRight() {
    scrollOffset = Math.min(maxScrollOffset, scrollOffset + (totalDuration / zoom) * 0.1);
    render();
  }

  // Handle mouse wheel for zoom and scroll
  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    
    if (event.ctrlKey) {
      // Zoom with Ctrl + wheel
      if (event.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    } else {
      // Scroll with wheel
      const scrollSpeed = (totalDuration / zoom) * 0.05;
      scrollOffset = Math.max(0, Math.min(maxScrollOffset, 
        scrollOffset + (event.deltaY > 0 ? scrollSpeed : -scrollSpeed)
      ));
      render();
    }
  }

  // Handle resize
  function handleResize() {
    if (canvas && ctx) {
      setupCanvas();
      generatePeaks();
      render();
    }
  }
</script>

<svelte:window on:resize={handleResize} />

<div class="waveform-container">
  <div class="waveform-controls">
    <button class="control-btn" on:click={handleScrollLeft} title="Scroll left">
      <!-- <ChevronLeft size={"16"} /> -->
    </button>
    <button class="control-btn" on:click={handleZoomOut} title="Zoom out">
      <!-- <ZoomOut size={"16"} /> -->
    </button>
    <span class="zoom-indicator">Zoom: {zoom.toFixed(1)}x</span>
    <button class="control-btn" on:click={handleZoomIn} title="Zoom in">
      <!-- <ZoomIn size={"16"} /> -->
    </button>
    <button class="control-btn" on:click={handleScrollRight} title="Scroll right">
      <!-- <ChevronRight size={"16"} /> -->
    </button>
  </div>
  
  <canvas
    bind:this={canvas}
    {width}
    {height}
    class="waveform-canvas"
    on:click={handleCanvasClick}
    on:wheel={handleWheel}
  ></canvas>
  
  {#if !audioBuffer}
    <div class="empty-state">
      <h3>No Audio Loaded</h3>
      <p>Upload an audio file to see the waveform display</p>
    </div>
  {/if}
</div>

<style>
  .waveform-container {
    position: relative;
    background: var(--bg-primary);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .waveform-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
  }

  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .control-btn:hover {
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
    transform: scale(1.05);
  }

  .zoom-indicator {
    color: var(--text-secondary);
    font-family: monospace;
    font-size: 0.8rem;
    margin: 0 var(--spacing-sm);
  }

  .waveform-canvas {
    display: block;
    width: 100%;
    cursor: pointer;
    background: var(--bg-primary);
  }

  .empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: var(--text-dimmed);
  }

  .empty-state h3 {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--text-secondary);
  }

  .empty-state p {
    margin: 0;
    font-size: 0.9rem;
  }
</style> 