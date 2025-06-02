<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import WaveSurfer from 'wavesurfer.js';

  // This is needed for importing in other components
  const WaveformDisplay = {};
  export default WaveformDisplay;

  export let url: string = '';
  let audioElement: HTMLAudioElement | null = null;
  let container: HTMLDivElement;
  let fallbackMode = true; // Always use fallback mode due to WaveSurfer errors
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (url && container) {
      initAudioPlayer();
    }
    return () => cleanupPlayer();
  });

  onDestroy(() => {
    cleanupPlayer();
  });

  // Watch for URL changes
  $: if (url && container) {
    initAudioPlayer();
  }

  function initAudioPlayer() {
    cleanupPlayer();
    if (!url) return;

    console.log('[WaveformDisplay] Loading audio URL:', url);
    
    // Create a basic audio player as fallback
    audioElement = document.createElement('audio');
    audioElement.controls = true;
    audioElement.src = url;
    audioElement.style.width = '100%';
    audioElement.style.marginTop = '10px';
    
    // Add a message about fallback mode
    const msgEl = document.createElement('div');
    msgEl.textContent = 'Using basic audio player (waveform visualization unavailable)';
    msgEl.style.color = '#ff9800';
    msgEl.style.marginBottom = '10px';
    msgEl.style.textAlign = 'center';
    msgEl.style.padding = '5px';
    
    // Clear container and add elements
    container.innerHTML = '';
    container.appendChild(msgEl);
    container.appendChild(audioElement);
    
    // Set up event listeners
    audioElement.addEventListener('timeupdate', () => {
      if (audioElement) {
        currentTime = audioElement.currentTime;
        dispatch('audioprocess', { currentTime });
      }
    });
    
    audioElement.addEventListener('loadedmetadata', () => {
      if (audioElement) {
        duration = audioElement.duration;
        dispatch('ready', { duration });
      }
    });
    
    audioElement.addEventListener('play', () => {
      isPlaying = true;
      dispatch('play');
    });
    
    audioElement.addEventListener('pause', () => {
      isPlaying = false;
      dispatch('pause');
    });
    
    audioElement.addEventListener('ended', () => {
      isPlaying = false;
      dispatch('finish');
    });
  }

  function cleanupPlayer() {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
    
    if (container) {
      container.innerHTML = '';
    }
    
    audioElement = null;
  }
  
  // Public API methods
  export function play() {
    audioElement?.play();
  }
  
  export function pause() {
    audioElement?.pause();
  }
  
  export function stop() {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  }
  
  export function seekTo(progress: number) {
    if (audioElement && audioElement.duration) {
      audioElement.currentTime = progress * audioElement.duration;
    }
  }
  
  export function setCurrentTime(time: number) {
    if (audioElement) {
      audioElement.currentTime = time;
    }
  }
  
  export function getCurrentTime(): number {
    return audioElement?.currentTime || 0;
  }
  
  export function getDuration(): number {
    return audioElement?.duration || 0;
  }
</script>

<div class="waveform-container">
  <div class="wavesurfer-container" bind:this={container}></div>
  {#if fallbackMode}
    <div class="fallback-note">Note: Standard audio player mode active (waveform visualization disabled)</div>
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
    padding: 10px;
  }
  
  .fallback-note {
    color: #ff9800;
    text-align: center;
    margin-top: 4px;
    font-size: 0.9em;
  }
</style>
