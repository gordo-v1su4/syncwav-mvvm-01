<script lang="ts">
  import { uiStore, toggleLeftPanel, toggleRightPanel } from '$lib/stores/uiStore';
  import { audioEngineStore } from '$lib/stores/audioEngineStore';
  import { projectStore } from '$lib/stores/projectStore';
  import WaveformDisplay from './WaveformDisplay.svelte';
  import PlaybackControls from './PlaybackControls.svelte';
  import AudioAnalysisControls from './AudioAnalysisControls.svelte';
  import AudioDebugger from './AudioDebugger.svelte';
  import { formatTime } from '$lib/utils/audioUtils';
  import { loadAudioFromUrl } from '$lib/utils/audioService';
  import { onMount } from 'svelte';

  $: panelStates = $uiStore.panelStates;
  $: audioState = $audioEngineStore;
  $: projectState = $projectStore;
  
  let isLoading = false;
  let loadError = '';

  // Load audio from backend when component mounts
  onMount(async () => {
    console.log("MainEditingInterfaceView mounted");
    console.log("Project state:", projectState);
    console.log("Audio state:", audioState);
    
    // Check if we have master audio info with a backend path
    if (projectState.masterAudioInfo?.backendPath) {
      if (audioState.audioBuffer) {
        console.log("Audio buffer already exists in store, not reloading");
        return;
      }
      
      try {
        console.log("Starting audio load from URL:", projectState.masterAudioInfo.backendPath);
        isLoading = true;
        loadError = '';
        
        // Add a small delay to ensure the UI updates
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const buffer = await loadAudioFromUrl(projectState.masterAudioInfo.backendPath);
        console.log("Audio loaded successfully:", 
          `length: ${buffer.length}, ` +
          `duration: ${buffer.duration}, ` +
          `channels: ${buffer.numberOfChannels}`
        );
        
        // Log the updated audio state
        console.log("Audio buffer loaded:", {
          hasBuffer: !!$audioEngineStore.audioBuffer,
          duration: $audioEngineStore.audioBuffer?.duration,
          sampleRate: $audioEngineStore.audioBuffer?.sampleRate,
          channels: $audioEngineStore.audioBuffer?.numberOfChannels
        });
        
      } catch (error) {
        console.error("Failed to load audio from backend:", error);
        loadError = "Failed to load audio waveform. Please try again.";
      } finally {
        isLoading = false;
      }
    } else {
      console.log("No master audio info or backend path available");
      console.log("projectState.masterAudioInfo:", projectState.masterAudioInfo);
    }
    
    // Log the audio state after loading attempt
    console.log("Final audio state after mount:", {
      hasBuffer: !!$audioEngineStore.audioBuffer,
      duration: $audioEngineStore.audioBuffer?.duration,
      sampleRate: $audioEngineStore.audioBuffer?.sampleRate,
      channels: $audioEngineStore.audioBuffer?.numberOfChannels
    });
  });

  // Handle seek from waveform
  function handleWaveformSeek(event: CustomEvent<{ time: number }>) {
    // The PlaybackControls component handles the actual seeking
    // This just forwards the event
    audioEngineStore.update(state => ({
      ...state,
      currentTime: event.detail.time
    }));
  }
</script>

<div class="main-workspace">
  <!-- Master Waveform Display Row -->
  <div class="waveform-display" style="grid-area: waveform; background: #000; padding: 0; overflow: hidden;">
    {#if isLoading}
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Loading audio waveform...</p>
      </div>
    {:else if loadError}
      <div class="error-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>{loadError}</p>
        <button on:click={() => {
          loadError = '';
          if (projectState.masterAudioInfo?.backendPath) {
            isLoading = true;
            loadAudioFromUrl(projectState.masterAudioInfo.backendPath)
              .then(() => isLoading = false)
              .catch(err => {
                console.error("Failed to reload audio:", err);
                loadError = "Failed to load audio waveform. Please try again.";
                isLoading = false;
              });
          }
        }}>Try Again</button>
      </div>
    {/if}
    
    <!-- Audio Buffer Status -->
    <div style="position: absolute; top: 5px; right: 10px; z-index: 10; background: rgba(0,0,0,0.7); color: white; font-size: 10px; padding: 3px 6px; border-radius: 4px;">
      {audioState.audioBuffer ? 'Audio Buffer: ' + audioState.audioBuffer.duration.toFixed(2) + 's' : 'No Audio Buffer'}
    </div>
    
    <!-- Single Waveform Display Component -->
    {#if audioState.audioBuffer}
      <WaveformDisplay
        audioBuffer={audioState.audioBuffer}
        width={document.querySelector('.waveform-display')?.clientWidth || 800}
        height={120}
        on:seek={handleWaveformSeek}
      />
    {:else}
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: red; font-weight: bold; background: rgba(0,0,0,0.7); padding: 5px; z-index: 100;">
        AudioBuffer is missing!
      </div>
    {/if}
  </div>

  <!-- Left Side Panel -->
  <div class="asset-panel" style="grid-area: asset-panel;" class:collapsed={panelStates.leftPanelCollapsed}>
    <div class="panel-header">
      <button class="collapse-btn" on:click={toggleLeftPanel} title="Toggle panel">
        {#if panelStates.leftPanelCollapsed}
          <!-- <ChevronRight size={"16"} /> -->
        {:else}
          <!-- <ChevronLeft size={"16"} /> -->
        {/if}
      </button>
    </div>
    <div class="panel-content">
      <div class="asset-section">
        <h5>Video Clips</h5>
        <div class="asset-list">
          {#each projectState.videoClips as clip}
            <div class="asset-item" class:selected={clip.isSelected} title="{clip.name} ({clip.duration > 0 ? formatTime(clip.duration) : 'Unknown duration'})">
              <div class="asset-thumbnail">
                {#if clip.thumbnail}
                  <img src={clip.thumbnail} alt={clip.name} />
                {:else}
                  <div class="thumbnail-placeholder"></div>
                {/if}
              </div>
              <!-- Duration badge instead of text label -->
              {#if clip.duration > 0}
                <div class="duration-badge">{formatTime(clip.duration)}</div>
              {/if}
            </div>
          {/each}
          {#if projectState.videoClips.length === 0}
            <div class="empty-asset-list">
              <p>No video clips uploaded</p>
              <small>Go to SETUP mode to upload videos</small>
            </div>
          {/if}
        </div>
      </div>
      <div class="asset-section">
        <h5>AI Generations</h5>
        <p class="coming-soon">Coming Soon</p>
        <button class="import-button">Import Additional Clips</button>
      </div>
    </div>
  </div>

  <!-- Center: Video Preview -->
  <div class="video-preview" style="grid-area: video-preview;">
    <div class="video-container">
      <canvas class="video-canvas" width="640" height="360"></canvas>
      <div class="video-overlay">
        <div class="video-controls">
          <button class="video-control-btn" title="Fullscreen">⛶</button>
          <span class="video-status">Preview: {audioState.audioBuffer ? 'Ready' : 'No Audio Loaded'}</span>
        </div>
      </div>
    </div>
    
    <!-- Video preview only - removed alternative visualizations -->
  </div>

  <!-- Center: Video Timeline -->
  <div class="video-timeline" style="grid-area: video-timeline;">
    <div class="timeline-header">
      <h4>Video Timeline</h4>
      <div class="timeline-tools">
        <button class="timeline-btn">Snap to Markers</button>
      </div>
    </div>
    <div class="timeline-content">
      <div class="timeline-track">
        {#each projectState.videoClips as clip}
          <div 
            class="clip-block" 
            class:selected={clip.isSelected}
            class:playing={clip.isPlaying}
            style="left: {(clip.startTime / (audioState.totalDuration || 60)) * 100}%; width: {((clip.endTime - clip.startTime) / (audioState.totalDuration || 60)) * 100}%;"
          >
            <span class="clip-name">{clip.name}</span>
          </div>
        {/each}
        {#if projectState.videoClips.length === 0}
          <div class="empty-timeline">
            <p>Drag video clips from the Asset Library to create your sequence</p>
          </div>
        {/if}
      </div>
      <div class="timeline-ruler">
        <div class="time-marker" style="left: 0%;">0:00</div>
        <div class="time-marker" style="left: 25%;">{formatTime((audioState.totalDuration || 240) * 0.25)}</div>
        <div class="time-marker" style="left: 50%;">{formatTime((audioState.totalDuration || 240) * 0.5)}</div>
        <div class="time-marker" style="left: 75%;">{formatTime((audioState.totalDuration || 240) * 0.75)}</div>
        <div class="time-marker" style="left: 100%;">{formatTime(audioState.totalDuration || 240)}</div>
      </div>
    </div>
  </div>

  <!-- Right Side Panel -->
  <div class="control-panel" style="grid-area: control-panel;" class:collapsed={panelStates.rightPanelCollapsed}>
    <div class="panel-header">
      <button class="collapse-btn" on:click={toggleRightPanel} title="Toggle panel">
        {#if panelStates.rightPanelCollapsed}
          <!-- <ChevronLeft size={"16"} /> -->
        {:else}
          <!-- <ChevronRight size={"16"} /> -->
        {/if}
      </button>
    </div>
    <div class="panel-content">
      <!-- Audio Analysis Tools -->
      <!-- Audio Analysis Controls -->
      <AudioAnalysisControls />
    </div>
  </div>


  <!-- Master Playback Controls -->
  <div class="playback-controls-container" style="grid-area: playback;">
    <PlaybackControls />
  </div>
</div>

<style>
.main-workspace {
   height: 100%;
   display: grid;
   grid-template-areas: 
    "asset-panel video-preview control-panel"
    "asset-panel waveform control-panel" 
    "asset-panel video-timeline control-panel"
    "playback playback playback";
   grid-template-columns: 280px 1fr 320px;
   grid-template-rows: 1fr 120px 180px 60px;
   gap: 2px;
   background: #1a1a1a;
   box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
 }

.main-workspace:has(.asset-panel.collapsed) {
  grid-template-columns: 40px 1fr 320px;
}

.main-workspace:has(.control-panel.collapsed) {
  grid-template-columns: 280px 1fr 40px;
}

.main-workspace:has(.asset-panel.collapsed):has(.control-panel.collapsed) {
  grid-template-columns: 40px 1fr 40px;
}

  /* Grid Area Components */
  .waveform-display,
  .asset-panel,
  .video-preview,
  .video-timeline,
  .control-panel {
    background: var(--bg-secondary);
    overflow: hidden;
  }

  /* Master Waveform Display */
  .waveform-display {
    background: #000;
    position: relative;
    height: 120px; /* Ensure container has fixed height */
    min-height: 120px;
    max-height: 120px;
    overflow: hidden;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
  }
  
  
  /* Loading and Error Overlays */
  .loading-overlay,
  .error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10;
    color: var(--text-primary);
    gap: var(--spacing-md);
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--bg-tertiary);
    border-top: 4px solid var(--neon-accent-1);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-overlay svg {
    color: var(--color-error);
    margin-bottom: var(--spacing-sm);
  }
  
  .error-overlay p {
    text-align: center;
    margin: 0 0 var(--spacing-md) 0;
  }
  
  .error-overlay button {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--neon-accent-1);
    color: var(--bg-primary);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .error-overlay button:hover {
    background: var(--neon-accent-2);
    transform: translateY(-2px);
  }

  /* Panel Styling */
  .asset-panel, .control-panel {
    background: #252525;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .asset-panel.collapsed {
    grid-template-columns: 40px 1fr 320px;
  }

  .control-panel.collapsed {
    grid-template-columns: 280px 1fr 40px;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 8px;
    background: linear-gradient(to bottom, #333333, #2a2a2a);
    border-bottom: 1px solid #1a1a1a;
    min-height: 36px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  /* Panel header styling simplified - removed h4 selectors */

  .collapse-btn {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #a0a0a0;
    cursor: pointer;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    transition: all 0.2s ease;
  }

  .collapse-btn:hover {
    background: rgba(0, 0, 0, 0.3);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .panel-content {
    flex: 1;
    padding: 12px;
    overflow-y: auto;
    background: linear-gradient(to bottom, #252525, #202020);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .collapsed .panel-content {
    display: none;
  }

  /* Asset Library Styling */
  .asset-section {
    margin-bottom: var(--spacing-lg);
  }

  .asset-section h5 {
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .asset-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
  }

  .asset-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-xs);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    border: 1px solid transparent;
    position: relative;
  }

  .asset-item:hover {
    background: rgba(80, 80, 80, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .asset-item.selected {
    border-color: #4db6ac; /* Match playhead color */
    background: rgba(77, 182, 172, 0.1);
    box-shadow: 0 0 8px rgba(77, 182, 172, 0.3);
  }

  .asset-thumbnail {
    width: 80px;
    height: 45px;
    background: var(--bg-primary);
    border-radius: var(--radius-sm);
    flex-shrink: 0;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    margin-bottom: 4px;
  }

  .asset-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .duration-badge {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 0.7rem;
    padding: 2px 4px;
    border-radius: 2px;
    font-family: monospace;
  }

  .thumbnail-placeholder {
    width: 100%;
    height: 100%;
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-dimmed);
    font-size: 0.7rem;
  }

  /* Removed unused asset info, name, and duration selectors */

  .empty-asset-list {
    text-align: center;
    padding: var(--spacing-lg);
    color: var(--text-dimmed);
  }

  .empty-asset-list p {
    margin: 0 0 var(--spacing-xs) 0;
  }

  .empty-asset-list small {
    font-size: 0.8rem;
  }

  .coming-soon {
    color: var(--text-dimmed);
    font-style: italic;
    margin-bottom: var(--spacing-sm);
  }

  .import-button {
    width: 100%;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
  }

  .import-button:hover {
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
  }

  /* Video Preview */
  .video-preview {
    position: relative;
    background: #151515;
    border-radius: 4px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4);
    overflow: hidden;
  }

  .video-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: linear-gradient(to bottom, #1a1a1a, #121212);
  }

  .video-canvas {
    background: #000;
    border-radius: 4px;
    max-width: 100%;
    max-height: 100%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    border: 1px solid #333;
  }

  .video-overlay {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
  }

  .video-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.7);
    padding: 6px 10px;
    border-radius: 4px;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .video-control-btn {
    background: rgba(77, 182, 172, 0.1);
    border: 1px solid rgba(77, 182, 172, 0.3);
    color: #4db6ac;
    cursor: pointer;
    font-size: 1rem;
    padding: 4px 8px;
    border-radius: 3px;
    transition: all 0.2s ease;
  }

  .video-control-btn:hover {
    background: rgba(77, 182, 172, 0.2);
    border-color: rgba(77, 182, 172, 0.5);
    transform: translateY(-1px);
  }

  .video-status {
    color: #a0a0a0;
    font-size: 0.8rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  /* Video Timeline */
  .video-timeline {
    background: #1d1d1d;
    border-radius: 4px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4);
    overflow: hidden;
  }

  .timeline-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: linear-gradient(to bottom, #333333, #2a2a2a);
    border-bottom: 1px solid #1a1a1a;
  }

  .timeline-header h4 {
    margin: 0;
    color: #e0e0e0;
    font-size: 0.9rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .timeline-btn {
    background: rgba(77, 182, 172, 0.1);
    border: 1px solid rgba(77, 182, 172, 0.3);
    color: #4db6ac;
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 0.8rem;
    transition: all 0.2s ease;
  }

  .timeline-btn:hover {
    background: rgba(77, 182, 172, 0.2);
    border-color: rgba(77, 182, 172, 0.5);
    transform: translateY(-1px);
  }

  .timeline-content {
    height: calc(100% - 40px);
    position: relative;
    padding: 12px;
    background: linear-gradient(to bottom, #202020, #181818);
  }

  .timeline-track {
    height: 40px;
    background: #151515;
    border-radius: 4px;
    position: relative;
    margin-bottom: 12px;
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.5);
    border: 1px solid #333;
  }

  .empty-timeline {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: var(--text-dimmed);
    font-size: 0.9rem;
  }

  .clip-block {
    position: absolute;
    height: calc(100% - 4px);
    top: 2px;
    background: linear-gradient(to bottom, #3a3a3a, #2a2a2a);
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #444;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .clip-block:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  }

  .clip-block.selected {
    border-color: #4db6ac;
    background: linear-gradient(to bottom, #2a4a45, #1d3935);
    box-shadow: 0 0 8px rgba(77, 182, 172, 0.4);
  }

  .clip-block.playing {
    border-color: #4db6ac;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 8px rgba(77, 182, 172, 0.6); }
    50% { box-shadow: 0 0 12px rgba(77, 182, 172, 0.3); }
  }

  .clip-name {
    display: none;
  }

  .timeline-ruler {
    display: flex;
    justify-content: space-between;
    position: relative;
    height: 20px;
    margin-top: 4px;
    border-top: 1px solid #333;
    padding-top: 4px;
  }

  .time-marker {
    color: #a0a0a0;
    font-size: 0.75rem;
    font-family: monospace;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
  }

  /* Control Panel Sections - Moved to individual component files */
  /* Playback controls moved to PlaybackControls.svelte */
</style>