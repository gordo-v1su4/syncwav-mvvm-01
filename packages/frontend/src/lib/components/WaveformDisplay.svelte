<script lang="ts">
  import { onMount, onDestroy, tick, createEventDispatcher } from 'svelte';
  import { audioEngineStore } from '$lib/stores/audioEngineStore';
  import { generateWaveformPeaks, timeToPixel, pixelToTime, calculateSamplesPerPixel, formatTime, generateWaveform } from '$lib/utils/audioUtils';
  import type { AudioPeakData, AudioMarker } from '$lib/types';
  // import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'svelte-lucide';

  // Props
  export let audioBuffer: AudioBuffer | null = null;
  export let width = 800;
  export let height = 120;

  // Internal state
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let waveformPeaks: Float32Array = new Float32Array(); // Rust WASM peaks
  let peakData: AudioPeakData[] = []; // Alternative peak format
  let zoom: number = 1.0;
  let scrollOffset: number = 0;
  let isScrolling: boolean = false;
  let isDragging: boolean = false;
  let markerPositions: { x: number; marker: AudioMarker; hitArea: { x1: number; x2: number; y1: number; y2: number } }[] = [];

  // Svelte store-derived values (declared for linter)
  let totalDuration: number = 0;
  let currentTime: number = 0;
  let markers: AudioMarker[] = [];
  let isPlaying: boolean = false;
  let maxScrollOffset: number = 0;

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
    console.log('[WaveformDisplay] mounted');
    let storeSubscription: () => void;
    let handleResize: () => void;
    
    // Initialize the canvas after DOM is ready
    tick().then(() => {
      canvas = document.getElementById('waveformCanvas') as HTMLCanvasElement;
      if (!canvas) {
        console.error('[WaveformDisplay] Canvas element not found');
        return;
      }
      
      ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('[WaveformDisplay] Could not get 2D context');
        return;
      }
      
      console.log('[WaveformDisplay] Canvas context acquired, setting up canvas');
      setupCanvas();
      
      // Force a small delay to ensure the canvas is properly sized
      setTimeout(() => {
        console.log('[WaveformDisplay] Generating waveform peaks after delay');
        generatePeaks();
      }, 100);
    });
    
    // Set up a subscription to the audio engine store
    storeSubscription = audioEngineStore.subscribe(state => {
      currentTime = state.currentTime;
      totalDuration = state.totalDuration;
      markers = state.markers;
      isPlaying = state.isPlaying;
      
      // Generate waveform if we have audio buffer but no waveform yet
      if (state.audioBuffer && !waveformPeaks) {
        console.log('[WaveformDisplay] Audio buffer available, generating waveform');
        generatePeaks();
      }
      
      // Trigger a render on each update if we have waveform data
      if (waveformPeaks && waveformPeaks.length > 0 && canvas && ctx) {
        render();
      }
    });
    
    // Add window resize handler
    handleResize = () => {
      if (canvas && ctx) {
        console.log('[WaveformDisplay] Window resized, updating canvas');
        setupCanvas();
        render();
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Return cleanup function
    return () => {
      console.log('[WaveformDisplay] Cleaning up subscriptions');
      if (storeSubscription) storeSubscription();
      if (handleResize) window.removeEventListener('resize', handleResize);
      console.log('[WaveformDisplay] Component unmounted');
    };
  });

  // Regenerate peaks when audio buffer changes
  let lastAudioBuffer: AudioBuffer | null = null;
  $: if (audioBuffer && canvas && audioBuffer !== lastAudioBuffer) {
    lastAudioBuffer = audioBuffer;
    generateWaveform(audioBuffer, 100).then(peaksArr => {
      waveformPeaks = peaksArr;
      render();
    });
  }

  // Redraw on peaks/size change
  $: if (ctx && waveformPeaks && waveformPeaks.length > 0 && (width || height)) {
    render();
  }

  async function setupCanvas() {
    console.log('[WaveformDisplay] Setting up canvas');
    // Make sure we have a canvas element
    if (!canvas) {
      canvas = document.getElementById('waveformCanvas') as HTMLCanvasElement;
      if (!canvas) {
        console.error('[WaveformDisplay] Cannot setup canvas - canvas element missing');
        return;
      }
    }
    
    // Make sure we have a 2D context
    if (!ctx) {
      ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('[WaveformDisplay] Cannot setup canvas - 2D context could not be created');
        return;
      }
    }
    
    console.log("[WaveformDisplay] Setting up canvas...");
    
    // Get current dimensions
    const rect = canvas.getBoundingClientRect();
    console.log("[WaveformDisplay] Canvas bounding rect:", rect.width, rect.height);
    
    // If the canvas still has zero dimensions, force it
    if (rect.width === 0 || rect.height === 0) {
      console.warn("[WaveformDisplay] Canvas has zero dimensions during setup, forcing size...");
      canvas.style.width = '100%';
      canvas.style.height = '120px';
      // Try to get parent container width
      const parentWidth = canvas.parentElement?.offsetWidth || 800;
      canvas.width = parentWidth;
      canvas.height = 120;
    } else {
      // Set up high-DPI support
      const dpr = window.devicePixelRatio || 1;
      console.log("[WaveformDisplay] Device pixel ratio:", dpr);
      
      // Set the canvas size accounting for DPR
      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);
      
      // Set display size
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    }
    
    console.log("[WaveformDisplay] Canvas dimensions set to:", canvas.width, canvas.height);
  }


  async function generatePeaks() {
    if (!canvas || !ctx) {
      console.error('[WaveformDisplay] Cannot generate peaks - canvas or context missing');
      return;
    }

    if (!audioBuffer) {
      console.warn('[WaveformDisplay] No audio buffer available for peak generation');
      
      // Create a test sine wave buffer for debugging if no audio buffer is provided
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const testBuffer = audioCtx.createBuffer(1, 44100 * 3, 44100); // 3 seconds mono
        const channelData = testBuffer.getChannelData(0);
        
        // Generate a sine wave
        for (let i = 0; i < channelData.length; i++) {
          // Mix multiple frequencies for a more interesting waveform
          channelData[i] = 
            0.5 * Math.sin(i * 2 * Math.PI * 440 / 44100) + // 440Hz
            0.3 * Math.sin(i * 2 * Math.PI * 880 / 44100) + // 880Hz
            0.2 * Math.sin(i * 2 * Math.PI * 220 / 44100);  // 220Hz
        }
        
        console.log('[WaveformDisplay] Created test audio buffer for debugging');
        
        // Use the test buffer for waveform generation
        const samplesPerPixel = calculateSamplesPerPixel(testBuffer, canvas.width || 800, zoom);
        console.log('[WaveformDisplay] Generating test waveform with samplesPerPixel:', samplesPerPixel);
        
        waveformPeaks = await generateWaveform(testBuffer, Math.max(1, Math.floor(samplesPerPixel)));
        console.log('[WaveformDisplay] Generated test waveform with', waveformPeaks.length, 'peaks');
        console.log('[WaveformDisplay] First 10 peaks:', Array.from(waveformPeaks.slice(0, 10)));
        
        render();
      } catch (testError) {
        console.error('[WaveformDisplay] Failed to generate test waveform:', testError);
      }
      
      return;
    }
    
    try {
      console.log('[WaveformDisplay] Generating waveform peaks for', audioBuffer.duration, 'seconds of audio');
      const samplesPerPixel = calculateSamplesPerPixel(audioBuffer, canvas.width || 800, zoom);
      console.log('[WaveformDisplay] Using samplesPerPixel:', samplesPerPixel);
      
      // Try using generateWaveform directly instead of generateWaveformPeaks
      waveformPeaks = await generateWaveform(audioBuffer, Math.max(1, Math.floor(samplesPerPixel)));
      console.log('[WaveformDisplay] Generated', waveformPeaks.length, 'peaks directly with generateWaveform');
      console.log('[WaveformDisplay] First 10 peaks:', Array.from(waveformPeaks.slice(0, 10)));
      
      if (!waveformPeaks || waveformPeaks.length === 0) {
        console.warn('[WaveformDisplay] generateWaveform returned empty peaks, falling back to generateWaveformPeaks');
        
        // generateWaveformPeaks returns AudioPeakData[] instead of Float32Array
        peakData = await generateWaveformPeaks(audioBuffer, samplesPerPixel);
        console.log('[WaveformDisplay] Generated', peakData.length, 'peaks with generateWaveformPeaks');
        
        // Convert AudioPeakData[] to Float32Array for consistent rendering
        if (peakData && peakData.length > 0) {
          // Use the average of min and max for each peak
          waveformPeaks = new Float32Array(peakData.length);
          for (let i = 0; i < peakData.length; i++) {
            waveformPeaks[i] = Math.abs((peakData[i].max + peakData[i].min) / 2);
          }
          console.log('[WaveformDisplay] Converted AudioPeakData to Float32Array:', waveformPeaks.length, 'peaks');
        }
      }
      
      // Ensure we have peaks to render
      if (waveformPeaks && waveformPeaks.length > 0) {
        console.log('[WaveformDisplay] Successfully generated waveform peaks, rendering...');
        render();
      } else {
        console.error('[WaveformDisplay] Failed to generate any waveform peaks');
      }
    } catch (error) {
      console.error('[WaveformDisplay] Failed to generate peaks:', error);
    }
    drawPlayhead(canvas.width, canvas.height);
    
    // Draw time ruler
    drawTimeRuler(canvas.width, canvas.height);
    
    // console.log("[WaveformDisplay] Waveform rendering complete");
  }

  function drawMarkers(width: number, height: number) {
    if (!ctx) return;

    // Reset marker positions for hit testing
    markerPositions = [];

    markers.forEach(marker => {
      const x = timeToPixel(marker.time, totalDuration, width, zoom, scrollOffset);
      
      if (x >= 0 && x <= width) {
        drawMarker(marker, x, height);
        
        // Store marker position for hit testing
        markerPositions.push({
          marker,
          x,
          hitArea: { x1: x - 10, x2: x + 10, y1: 0, y2: 30 }
        });
      }
    });
  }

  function drawMarker(marker: AudioMarker, x: number, height: number) {
    if (!ctx) return;

    const colors = {
      beat: '#4db6ac',      // teal accent to match playhead
      transient: '#80cbc4', // lighter teal
      user: '#26a69a',      // darker teal
      stem: '#b2dfdb'       // very light teal
    };

    ctx.strokeStyle = marker.color || colors[marker.type] || colors.user;
    ctx.lineWidth = marker.type === 'beat' ? 2 : 1;
    ctx.setLineDash(marker.type === 'user' ? [5, 5] : []);

    // Draw vertical line
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.lineTo(x, height - 30);
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
      ctx.fillText(marker.label, x, height - 15);
    }
  }

  function drawPlayhead(width: number, height: number) {
    if (!ctx) return;

    const x = timeToPixel(currentTime, totalDuration, width, zoom, scrollOffset);
    
    // Auto-scroll when playhead reaches edge of visible area during playback
    if (isPlaying) {
      const margin = width * 0.1; // 10% margin
      if (x < margin || x > width - margin) {
        // Calculate new scroll offset to keep playhead visible with margin
        const targetTime = currentTime - (totalDuration / zoom) * 0.3; // Position at 30% of view
        scrollOffset = Math.max(0, Math.min(maxScrollOffset, targetTime));
      }
    }
    
    // Recalculate x position after possible scrollOffset change
    const updatedX = timeToPixel(currentTime, totalDuration, width, zoom, scrollOffset);
    
    if (updatedX >= 0 && updatedX <= width) {
      // Draw playhead line with a more visible color
      ctx.strokeStyle = '#4db6ac'; // Teal color that stands out but isn't too bright
      ctx.lineWidth = 2;
      ctx.setLineDash([]);

      // Draw playhead line
      ctx.beginPath();
      ctx.moveTo(updatedX, 0);
      ctx.lineTo(updatedX, height);
      ctx.stroke();

      // Draw playhead triangle at top
      ctx.fillStyle = '#4db6ac';
      ctx.beginPath();
      ctx.moveTo(updatedX, 0);
      ctx.lineTo(updatedX - 6, 12); // Slightly larger triangle
      ctx.lineTo(updatedX + 6, 12);
      ctx.closePath();
      ctx.fill();
      
      // Draw current time label with better visibility
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      // Add a background for better readability
      const timeText = formatTime(currentTime);
      const textWidth = ctx.measureText(timeText).width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(updatedX - textWidth/2 - 4, 14, textWidth + 8, 16);
      ctx.fillStyle = '#4db6ac';
      ctx.fillText(timeText, updatedX, 27);
    }
  }

  function drawTimeRuler(width: number, height: number) {
    if (!ctx) return;

    const visibleDuration = totalDuration / zoom;
    const startTime = scrollOffset;
    
    // Calculate appropriate time interval based on zoom
    let interval = 1; // seconds
    if (visibleDuration > 120) interval = 15;
    else if (visibleDuration > 60) interval = 10;
    else if (visibleDuration > 30) interval = 5;
    else if (visibleDuration > 10) interval = 2;
    else if (visibleDuration > 5) interval = 1;
    else if (visibleDuration > 2) interval = 0.5;
    else interval = 0.2;

    // Add minor tick marks between major intervals
    const minorInterval = interval / 5;
    
    ctx.fillStyle = '#808080';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    const startInterval = Math.ceil(startTime / interval) * interval;
    const endTime = startTime + visibleDuration;

    // Draw minor ticks first (background layer)
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 0.5;
    for (let time = Math.ceil(startTime / minorInterval) * minorInterval; time <= endTime; time += minorInterval) {
      if (time % interval !== 0) { // Skip major ticks, we'll draw them later
        const x = timeToPixel(time, totalDuration, width, zoom, scrollOffset);
        if (x >= 0 && x <= width) {
          ctx.beginPath();
          ctx.moveTo(x, height - 22);
          ctx.lineTo(x, height - 20);
          ctx.stroke();
        }
      }
    }

    // Draw major ticks and labels
    ctx.strokeStyle = '#3a9d73'; // Match waveform color
    ctx.lineWidth = 1;
    for (let time = startInterval; time <= endTime; time += interval) {
      const x = timeToPixel(time, totalDuration, width, zoom, scrollOffset);
      
      if (x >= 0 && x <= width) {
        // Draw tick mark
        ctx.beginPath();
        ctx.moveTo(x, height - 25);
        ctx.lineTo(x, height - 20);
        ctx.stroke();

        // Draw time label with improved visibility
        ctx.fillStyle = '#a0a0a0'; // Lighter gray for better readability
        ctx.fillText(formatTime(time), x, height - 5);
      }
    }
    
    // Draw current waveform view range with improved visibility
    ctx.fillStyle = '#4db6ac'; // Match playhead color
    ctx.textAlign = 'left';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`View: ${formatTime(startTime)} - ${formatTime(Math.min(startTime + visibleDuration, totalDuration))} (${visibleDuration.toFixed(1)}s)`, 5, height - 5);
  }

  // Store marker positions for hit testing
  // (Already declared at top, remove duplicate)

function drawWaveform(width: number, height: number) {
  if (!ctx) {
    console.error('[WaveformDisplay] Cannot draw waveform - context missing');
    return;
  }

  // Clear background
  ctx.clearRect(0, 0, width, height);

  // Draw test pattern if no audioBuffer or waveformPeaks
  if (!waveformPeaks || waveformPeaks.length === 0) {
    console.warn('[WaveformDisplay] Drawing test pattern - no waveform peaks', {
      hasAudioBuffer: !!audioBuffer,
      waveformPeaksLength: waveformPeaks?.length || 0
    });
    
    // Draw test pattern
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#FFFF00'; // Yellow line to indicate test pattern
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Draw diagonal pattern lines to make it obvious this is a test pattern
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let i = 0; i < width; i += 20) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 20, height);
    }
    ctx.stroke();
    
    // Add text to indicate there's no audio data
    ctx.fillStyle = '#FFFF00';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No Waveform Data Available', width / 2, height / 2 - 10);
    
    return;
  }

  // Draw waveform
  console.log('[WaveformDisplay] Drawing waveform with', waveformPeaks.length, 'peaks');
  
  // Waveform background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);
  
  // Draw the waveform with a more subtle color
  ctx.strokeStyle = '#3a9d73'; // More subtle green color
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const len = waveformPeaks.length;
  const scaleX = width / len;
  const centerY = height / 2;
  const scaleY = centerY * 0.8; // Use 80% of half-height for amplitude
  
  for (let i = 0; i < len; i++) {
    const x = i * scaleX;
    const y = centerY - waveformPeaks[i] * scaleY;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  // Draw mirror (bottom half) of waveform for visual effect
  ctx.strokeStyle = 'rgba(58, 157, 115, 0.4)'; // Matching color with transparency
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const x = i * scaleX;
    const y = centerY + waveformPeaks[i] * scaleY;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}


  function handleCanvasClick(event: MouseEvent) {
    if (!audioBuffer) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if a marker was clicked
    const clickedMarker = markerPositions.find(m =>
      x >= m.hitArea.x1 && x <= m.hitArea.x2 && y >= m.hitArea.y1 && y <= m.hitArea.y2
    );
    
    if (clickedMarker) {
      // Marker clicked, seek to its position and notify about selection
      dispatch('seek', { time: clickedMarker.marker.time });
      dispatch('markerSelect', { marker: clickedMarker.marker });
    } else {
      // No marker clicked, seek to the clicked position
      const clickTime = pixelToTime(x, totalDuration, canvas.clientWidth, zoom, scrollOffset);
      
      // Update currentTime immediately for responsive UI feedback
      currentTime = clickTime;
      
      // Then dispatch the seek event for the audio engine
      dispatch('seek', { time: clickTime });
      
      // Force a render to show the playhead immediately
      render();
    }
  }

  function handleZoomIn() {
    zoom = Math.min(10, zoom * 1.5);
    generatePeaks();
  }

  async function render() {
    // If canvas or context is missing, try to set them up first
    if (!canvas || !ctx) {
      console.log('[WaveformDisplay] Canvas or context missing, attempting to set up canvas');
      await setupCanvas();
      
      // If still missing after setup attempt, abort rendering
      if (!canvas || !ctx) {
        console.error('[WaveformDisplay] Cannot render - canvas or context still missing after setup attempt');
        return;
      }
    }
    
    console.log('[WaveformDisplay] Rendering waveform with canvas dimensions:', canvas.width, 'x', canvas.height);
    
    // Clear the entire canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each component
    drawWaveform(canvas.width, canvas.height);
    drawMarkers(canvas.width, canvas.height);
    drawPlayhead(canvas.width, canvas.height);
    drawTimeRuler(canvas.width, canvas.height);
  }

  function handleZoomOut() {
    zoom = Math.max(0.1, zoom / 1.5);
    generatePeaks();
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
      render();
    }
  }
</script>

<svelte:window on:resize={handleResize} />

<div class="waveform-container">
  <div class="canvas-container">
    <canvas
      bind:this={canvas}
      width={width}
      height={height}
      class="waveform-canvas"
      on:click={handleCanvasClick}
      on:wheel={handleWheel}
    ></canvas>
  </div>
  
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
    /* Ensure container has height */
    min-height: 120px;
  }

  /* Control styles removed as they're no longer used */

  .canvas-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 120px;
    background: #111;
    overflow: hidden;
  }
  
  .waveform-canvas {
    display: block;
    width: 100%;
    height: 100%; /* Ensure canvas takes full height of container */
    cursor: pointer;
    background: #000;
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