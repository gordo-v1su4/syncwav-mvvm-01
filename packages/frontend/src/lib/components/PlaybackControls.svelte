<script lang="ts">
  import { onMount } from 'svelte';
  import { audioEngineStore } from '$lib/stores/audioEngineStore';
  import { playAudio, pauseAudio, stopAudio, seekAudio } from '$lib/utils/audioService';
  import { formatTime } from '$lib/utils/audioUtils';

  export let waveformRef: any = null; // Reference to the WaveformDisplay component

  let isPlaying = false;
  let currentTime = 0;
  let duration = 0;
  
  // Subscribe to audio engine store for state updates
  const unsubscribe = audioEngineStore.subscribe(state => {
    isPlaying = state.isPlaying;
    currentTime = state.currentTime;
    duration = state.totalDuration;
  });

  onMount(() => {
    return () => {
      unsubscribe();
    };
  });

  function handlePlay() {
    if (waveformRef) {
      waveformRef.play();
    } else {
      playAudio();
    }
  }

  function handlePause() {
    if (waveformRef) {
      waveformRef.pause();
    } else {
      pauseAudio();
    }
  }

  function handleStop() {
    if (waveformRef) {
      waveformRef.stop();
    } else {
      stopAudio();
    }
  }

  function handleSeek(e: MouseEvent | KeyboardEvent) {
    const container = e.currentTarget as HTMLElement;
    let position: number;
    
    if (e instanceof MouseEvent) {
      const rect = container.getBoundingClientRect();
      position = (e.clientX - rect.left) / rect.width;
    } else {
      // Handle keyboard navigation
      const key = (e as KeyboardEvent).key;
      const step = 0.05; // 5% step for keyboard navigation
      
      position = currentTime / duration; // Current position
      
      if (key === 'ArrowRight') {
        position = Math.min(position + step, 1);
      } else if (key === 'ArrowLeft') {
        position = Math.max(position - step, 0);
      } else if (key === 'Home') {
        position = 0;
      } else if (key === 'End') {
        position = 1;
      } else {
        return; // Ignore other keys
      }
    }
    
    // Clamp position between 0 and 1
    position = Math.max(0, Math.min(1, position));
    
    if (waveformRef) {
      waveformRef.seekTo(position);
    } else {
      seekAudio(position * duration);
    }
  }
</script>

<div class="playback-controls">
  <div class="transport-buttons">
    <button class="control-button" on:click={handlePlay} aria-label="Play" disabled={!duration}>
      {#if isPlaying}
        <span class="icon">⏸</span>
      {:else}
        <span class="icon">▶</span>
      {/if}
    </button>
    <button class="control-button" on:click={handlePause} aria-label="Pause" disabled={!isPlaying}>
      <span class="icon">⏸</span>
    </button>
    <button class="control-button" on:click={handleStop} aria-label="Stop" disabled={!isPlaying && currentTime === 0}>
      <span class="icon">⏹</span>
    </button>
  </div>

  <div class="progress-wrapper" role="group" aria-label="Audio playback progress control">  
    <div 
      class="progress-container" 
      role="progressbar"
      aria-label="Audio progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round((currentTime / duration * 100) || 0)}
    >
      <div class="progress-bar" style="width: {(currentTime / duration * 100) || 0}%"></div>
      
      <!-- Invisible button that covers the progress bar to handle interactions -->
      <button 
        type="button" 
        class="progress-control-button"
        on:click={handleSeek}
        on:keydown={handleSeek}
        aria-label="Seek audio position"
        tabindex="0"
      >
        <span class="visually-hidden">Seek audio position</span>
      </button>
    </div>
  </div>

  <div class="time-display">
    <span>{formatTime(currentTime)}</span>
    <span class="time-separator">/</span>
    <span>{formatTime(duration)}</span>
  </div>
</div>

<style>
  .playback-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--bg-secondary, #1e1e1e);
    padding: 8px;
    border-radius: var(--radius-sm, 4px);
  }

  .transport-buttons {
    display: flex;
    gap: 8px;
  }

  .control-button {
    background: var(--bg-accent, #2c2c2c);
    color: var(--text-primary, #ffffff);
    border: none;
    border-radius: var(--radius-sm, 4px);
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    min-height: 36px;
  }

  .control-button:hover:not(:disabled) {
    background: var(--bg-accent-hover, #3a3a3a);
  }

  .control-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon {
    font-size: 1.2em;
  }

  .progress-wrapper {
    width: 100%;
  }

  .progress-container {
    height: 8px;
    background: var(--bg-primary, #121212);
    border-radius: var(--radius-pill, 999px);
    overflow: hidden;
    position: relative;
  }

  .progress-control-button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    border: none;
    padding: 0;
    background: transparent;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .progress-bar {
    height: 100%;
    background: var(--accent-primary, #4db6ac);
    border-radius: var(--radius-pill, 999px);
    transition: width 0.1s linear;
  }

  .time-display {
    display: flex;
    justify-content: space-between;
    color: var(--text-secondary, #aaaaaa);
    font-size: 0.9em;
  }

  .time-separator {
    margin: 0 4px;
  }
</style>
