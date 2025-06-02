<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import WaveSurfer from 'wavesurfer.js';

  export let url: string = '';
  let wavesurfer: WaveSurfer | null = null;
  let container: HTMLDivElement;
  let uploading = false;
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;

  const dispatch = createEventDispatcher();

  // Initialize player on mount
  onMount(() => {
    if (url && container) {
      initWaveSurfer();
    }
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
        wavesurfer = null;
      }
    };
  });

  // Watch for URL changes
  $: if (url && container) {
    initWaveSurfer();
  }

  function initWaveSurfer() {
    // Clean up any previous instance
    if (wavesurfer) {
      wavesurfer.destroy();
      wavesurfer = null;
    }

    if (container) {
      container.innerHTML = '';
    }

    console.log('[WaveformDisplay] Loading audio URL:', url);
    
    try {
      // Create with simple configuration to avoid the array length error
      wavesurfer = WaveSurfer.create({
        container,
        waveColor: '#3a9d73',
        progressColor: '#4db6ac',
        height: 100,
        barWidth: 2,
        cursorColor: '#ffeb3b',
        cursorWidth: 1,
        backend: 'WebAudio',
        normalize: false
      });
      
      // Set up event handlers
      wavesurfer.on('ready', () => {
        duration = wavesurfer.getDuration();
        dispatch('ready', { duration });
      });
      
      wavesurfer.on('audioprocess', () => {
        currentTime = wavesurfer.getCurrentTime();
        dispatch('audioprocess', { currentTime });
      });
      
      wavesurfer.on('play', () => {
        isPlaying = true;
        dispatch('play');
      });
      
      wavesurfer.on('pause', () => {
        isPlaying = false;
        dispatch('pause');
      });
      
      wavesurfer.on('finish', () => {
        isPlaying = false;
        dispatch('finish');
      });
      
      wavesurfer.on('error', (err) => {
        console.error('[WaveformDisplay] WaveSurfer error:', err);
        // Fall back to basic audio element if needed
        createFallbackPlayer();
      });
      
      // Load the audio
      wavesurfer.load(url);
    } catch (err) {
      console.error('[WaveformDisplay] Error creating WaveSurfer:', err);
      createFallbackPlayer();
    }
  }
  
  // Create a basic audio player as fallback
  function createFallbackPlayer() {
    if (container) {
      container.innerHTML = '';
      
      const audioEl = document.createElement('audio');
      audioEl.controls = true;
      audioEl.src = url;
      audioEl.style.width = '100%';
      
      const msgEl = document.createElement('div');
      msgEl.textContent = 'Using simple audio player (waveform visualization unavailable)';
      msgEl.style.color = '#ff9800';
      msgEl.style.textAlign = 'center';
      msgEl.style.padding = '10px';
      
      container.appendChild(msgEl);
      container.appendChild(audioEl);
    }
  }
  
  // Public API methods
  export function play() {
    wavesurfer?.play();
  }
  
  export function pause() {
    wavesurfer?.pause();
  }
  
  export function stop() {
    if (wavesurfer) {
      wavesurfer.pause();
      wavesurfer.seekTo(0);
    }
  }
  
  export function seekTo(progress: number) {
    wavesurfer?.seekTo(progress);
  }
  
  export function setCurrentTime(time: number) {
    if (wavesurfer && duration > 0) {
      wavesurfer.seekTo(time / duration);
    }
  }
  
  export function getCurrentTime(): number {
    return wavesurfer?.getCurrentTime() ?? 0;
  }
  
  export function getDuration(): number {
    return wavesurfer?.getDuration() ?? 0;
  }
</script>

<div class="waveform-container">
  <div class="wavesurfer-container" bind:this={container}></div>
  {#if (!url && !uploading)}
    <div class="placeholder">
      <p>Upload or select an audio file to view waveform</p>
    </div>
  {/if}
</div>

<style>
  .waveform-container {
    position: relative;
    background: var(--bg-primary, #121212);
    border-radius: var(--radius-sm, 4px);
    padding: 8px;
    margin-bottom: 16px;
  }
  
  .wavesurfer-container {
    width: 100%;
    min-height: 120px;
    background: #181818;
    border: 1px solid #4db6ac;
    border-radius: 2px;
  }
  
  .placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    font-style: italic;
  }
</style>
