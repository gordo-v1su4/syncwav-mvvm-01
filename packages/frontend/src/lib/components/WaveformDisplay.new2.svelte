<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import WaveSurfer from 'wavesurfer.js';

  export let url: string = '';
  let audioElement: HTMLAudioElement | null = null;
  let container: HTMLDivElement;
  let fallbackMode = true; // Always use fallback mode due to WaveSurfer errors
  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;

  const dispatch = createEventDispatcher();

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

  onMount(() => {
    // Wait until next tick to ensure DOM elements are ready
    setTimeout(() => {
      if (url && container) {
        initAudioPlayer();
      }
    }, 0);
    
    return () => cleanupPlayer();
  });

  onDestroy(() => {
    cleanupPlayer();
  });

  // Watch for URL changes with defensive check
  $: if (url && typeof container !== 'undefined' && container) {
    // Use setTimeout to ensure we're not in the middle of a Svelte update cycle
    setTimeout(() => {
      initAudioPlayer();
    }, 0);
  }

  function initAudioPlayer() {
    try {
      cleanupPlayer();
      if (!url || !container) return;
      
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
    } catch (error) {
      console.error('[WaveformDisplay] Error initializing audio player:', error);
      cleanupPlayer();
      
      // Add error message to container
      if (container) {
        container.innerHTML = `
          <div style="color: #f44336; padding: 10px; text-align: center;">
            Error loading audio player. Please try again or use a different file.
          </div>
        `;
      }
    }
  }
  
  // Public API - these methods provide the same interface as WaveSurfer would
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
