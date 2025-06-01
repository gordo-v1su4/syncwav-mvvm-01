<script lang="ts">
  import { audioEngineStore } from '$lib/stores/audioEngineStore';
  import { playAudio, pauseAudio, stopAudio, seekAudio, setAudioVolume, toggleAudioLoop } from '$lib/utils/audioService';
  import { formatTime } from '$lib/utils/audioUtils';

  export let showExtendedControls = true;

  // Handle playback actions
  async function handlePlay() {
    try {
      if ($audioEngineStore.isPlaying) {
        pauseAudio();
      } else {
        await playAudio();
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  }

  function handleStop() {
    stopAudio();
  }

  function handleSkipBack() {
    const newTime = Math.max(0, $audioEngineStore.currentTime - 10);
    seekAudio(newTime);
  }

  function handleSkipForward() {
    const newTime = Math.min($audioEngineStore.totalDuration, $audioEngineStore.currentTime + 10);
    seekAudio(newTime);
  }

  function handleVolumeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const volume = parseFloat(target.value);
    setAudioVolume(volume);
  }

  function handleLoop() {
    toggleAudioLoop();
  }
</script>

<div class="playback-controls">
  <div class="playback-main">
    <button 
      class="playback-btn secondary" 
      on:click={handleSkipBack} 
      disabled={!$audioEngineStore.audioBuffer} 
      title="Skip back 10 seconds"
      aria-label="Skip back 10 seconds"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polygon points="19 20 9 12 19 4 19 20" />
        <line x1="5" y1="19" x2="5" y2="5" />
      </svg>
      <span class="sr-only">Skip back 10 seconds</span>
    </button>
    
    <button 
      class="playback-btn primary" 
      on:click={handlePlay} 
      disabled={!$audioEngineStore.audioBuffer} 
      title={$audioEngineStore.isPlaying ? 'Pause' : 'Play'}
      aria-label={$audioEngineStore.isPlaying ? 'Pause' : 'Play'}
    >
      {#if $audioEngineStore.isPlaying}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      {:else}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      {/if}
      <span class="sr-only">{$audioEngineStore.isPlaying ? 'Pause' : 'Play'}</span>
    </button>
    
    <button 
      class="playback-btn secondary" 
      on:click={handleStop} 
      disabled={!$audioEngineStore.audioBuffer} 
      title="Stop"
      aria-label="Stop"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      </svg>
      <span class="sr-only">Stop</span>
    </button>
    
    <button 
      class="playback-btn secondary" 
      on:click={handleSkipForward} 
      disabled={!$audioEngineStore.audioBuffer} 
      title="Skip forward 10 seconds"
      aria-label="Skip forward 10 seconds"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polygon points="5 4 15 12 5 20 5 4" />
        <line x1="19" y1="5" x2="19" y2="19" />
      </svg>
      <span class="sr-only">Skip forward 10 seconds</span>
    </button>
    <button 
      class="playback-btn secondary loop-btn" 
      class:active={$audioEngineStore.isLooping}
      on:click={handleLoop} 
      disabled={!$audioEngineStore.audioBuffer}
      title="Toggle loop"
      aria-label="Toggle loop"
      aria-pressed={$audioEngineStore.isLooping}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M17 1l4 4-4 4" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <path d="M7 23l-4-4 4-4" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
      <span class="sr-only">Toggle loop</span>
    </button>
  </div>

  <div class="playback-time">
    <span class="time-display">
      {formatTime($audioEngineStore.currentTime)} / {formatTime($audioEngineStore.totalDuration)}
    </span>
  </div>

  {#if showExtendedControls}
    <div class="playback-controls-extended">
      <div class="volume-control">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          value={$audioEngineStore.volume}
          class="volume-slider"
          on:input={handleVolumeChange}
          disabled={!$audioEngineStore.audioBuffer}
          aria-label="Volume"
        >
      </div>
    </div>
  {/if}
</div>

<style>
  /* Screen reader only utility class */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .playback-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg-tertiary);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    gap: var(--spacing-md);
  }

  .playback-main {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .playback-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .playback-btn.primary {
    width: 42px;
    height: 42px;
    background: var(--neon-accent-1);
    color: var(--bg-primary);
    border-color: var(--neon-accent-1);
  }

  .playback-btn:hover:not(:disabled) {
    border-color: var(--neon-accent-1);
    transform: scale(1.05);
  }

  .playback-btn.primary:hover:not(:disabled) {
    background: var(--neon-accent-1);
    transform: scale(1.1);
  }

  .playback-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .loop-btn.active {
    background: var(--neon-accent-2);
    border-color: var(--neon-accent-2);
    color: var(--bg-primary);
  }

  .playback-time {
    margin: 0 var(--spacing-md);
  }

  .time-display {
    color: var(--text-primary);
    font-family: monospace;
    font-size: 0.9rem;
    min-width: 100px;
  }

  .playback-controls-extended {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .volume-control {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .volume-slider {
    width: 80px;
    accent-color: var(--neon-accent-1);
  }
</style>