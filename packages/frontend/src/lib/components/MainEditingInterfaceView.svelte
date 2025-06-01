<script lang="ts">
  import { uiStore, toggleLeftPanel, toggleRightPanel } from '$lib/stores/uiStore';
  import { audioEngineStore } from '$lib/stores/audioEngineStore';
  import { projectStore } from '$lib/stores/projectStore';
  import WaveformDisplay from './WaveformDisplay.svelte';
  import PlaybackControls from './PlaybackControls.svelte';
  import AudioAnalysisControls from './AudioAnalysisControls.svelte';
  import { formatTime } from '$lib/utils/audioUtils';

  $: panelStates = $uiStore.panelStates;
  $: audioState = $audioEngineStore;
  $: projectState = $projectStore;

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
  <div class="waveform-display" style="grid-area: waveform;">
    <WaveformDisplay 
      audioBuffer={audioState.audioBuffer}
      on:seek={handleWaveformSeek}
    />
  </div>

  <!-- Left Side Panel: Asset Library -->
  <div class="asset-panel" style="grid-area: asset-panel;" class:collapsed={panelStates.leftPanelCollapsed}>
    <div class="panel-header">
      <!-- <Library size={"20"} /> -->
      <h4>Asset Library</h4>
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
            <div class="asset-item" class:selected={clip.isSelected}>
              <div class="asset-thumbnail">
                {#if clip.thumbnail}
                  <img src={clip.thumbnail} alt={clip.name} />
                {:else}
                  <div class="thumbnail-placeholder"></div>
                {/if}
              </div>
              <div class="asset-info">
                <span class="asset-name">{clip.name}</span>
                {#if clip.duration > 0}
                  <span class="asset-duration">{formatTime(clip.duration)}</span>
                {/if}
              </div>
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

  <!-- Right Side Panel: Audio-Driven Control Panel -->
  <div class="control-panel" style="grid-area: control-panel;" class:collapsed={panelStates.rightPanelCollapsed}>
    <div class="panel-header">
      <!-- <Settings size={"20"} /> -->
      <h4>Audio-Visual Controls</h4>
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
     "asset-panel waveform control-panel"
     "asset-panel video-preview control-panel" 
     "asset-panel video-timeline control-panel"
     "playback playback playback";
   grid-template-columns: 280px 1fr 320px;
   grid-template-rows: 120px 1fr 180px 80px;
   gap: 1px;
   background: var(--border-color);
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
  .control-panel,
  .playback-controls {
    background: var(--bg-secondary);
    overflow: hidden;
  }

  /* Master Waveform Display */
  .waveform-display {
    background: var(--bg-primary);
    position: relative;
  }

  /* Panel System */
  .asset-panel,
  .control-panel {
    display: flex;
    flex-direction: column;
    transition: all var(--transition-normal);
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
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    min-height: 48px;
  }

  .panel-header h4 {
    flex: 1;
    margin: 0;
    color: var(--text-primary);
    font-size: 0.9rem;
  }

  .collapsed .panel-header h4 {
    display: none;
  }

  .collapse-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    transition: color var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .collapse-btn:hover {
    color: var(--neon-accent-1);
  }

  .panel-content {
    flex: 1;
    padding: var(--spacing-md);
    overflow-y: auto;
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
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .asset-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    border: 1px solid transparent;
  }

  .asset-item:hover {
    background: var(--hover-bg);
    transform: translateY(-1px);
  }

  .asset-item.selected {
    border-color: var(--neon-accent-1);
    background: var(--bg-elevated);
  }

  .asset-thumbnail {
    width: 48px;
    height: 27px;
    background: var(--bg-primary);
    border-radius: var(--radius-sm);
    flex-shrink: 0;
    overflow: hidden;
  }

  .asset-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

  .asset-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .asset-name {
    color: var(--text-primary);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .asset-duration {
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-family: monospace;
  }

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
    background: var(--bg-primary);
  }

  .video-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .video-canvas {
    background: #000;
    border-radius: var(--radius-sm);
    max-width: 100%;
    max-height: 100%;
  }

  .video-overlay {
    position: absolute;
    top: 0;
    right: 0;
    padding: var(--spacing-sm);
  }

  .video-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    background: rgba(0, 0, 0, 0.7);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
  }

  .video-control-btn {
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    font-size: 1rem;
  }

  .video-status {
    color: var(--text-secondary);
    font-size: 0.8rem;
  }

  /* Video Timeline */
  .video-timeline {
    background: var(--bg-secondary);
  }

  .timeline-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
  }

  .timeline-header h4 {
    margin: 0;
    color: var(--text-primary);
    font-size: 0.9rem;
  }

  .timeline-btn {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
  }

  .timeline-btn:hover {
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
  }

  .timeline-content {
    height: calc(100% - 48px);
    position: relative;
    padding: var(--spacing-md);
  }

  .timeline-track {
    height: 40px;
    background: var(--bg-primary);
    border-radius: var(--radius-sm);
    position: relative;
    margin-bottom: var(--spacing-md);
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
    height: 100%;
    background: #2a2a2a;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    padding: 0 var(--spacing-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    border: 2px solid transparent;
  }

  .clip-block.selected {
    border-color: var(--neon-accent-1);
  }

  .clip-block.playing {
    border-color: var(--neon-accent-2);
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { border-color: var(--neon-accent-2); }
    50% { border-color: rgba(255, 107, 53, 0.5); }
  }

  .clip-name {
    color: var(--text-primary);
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .timeline-ruler {
    display: flex;
    justify-content: space-between;
    position: relative;
  }

  .time-marker {
    color: var(--text-dimmed);
    font-size: 0.75rem;
    font-family: monospace;
  }

  /* Control Panel Sections */
  .control-section {
    margin-bottom: var(--spacing-lg);
  }

  .control-section h5 {
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .analysis-tools {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .analysis-btn {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    text-align: left;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .analysis-btn:hover:not(:disabled) {
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
  }

  .analysis-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .analysis-btn.toggle.active {
    background: var(--neon-accent-1);
    color: var(--bg-primary);
    border-color: var(--neon-accent-1);
  }

  .stem-controls {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .stem-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
  }

  .stem-item span {
    flex: 1;
    color: var(--text-primary);
    font-size: 0.85rem;
  }

  .stem-solo,
  .stem-detect {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .stem-solo:hover:not(:disabled),
  .stem-detect:hover:not(:disabled) {
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
  }

  .stem-solo:disabled,
  .stem-detect:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .stem-note,
  .sync-note {
    font-size: 0.8rem;
    color: var(--text-dimmed);
    font-style: italic;
    margin-top: var(--spacing-sm);
  }

  .sync-controls {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .sync-controls label {
    color: var(--text-secondary);
    font-size: 0.85rem;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .sync-select,
  .sync-input {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
  }

  .sync-select:disabled,
  .sync-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Playback Controls */
  .playback-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--bg-tertiary);
  }

  .playback-main {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .playback-btn {
    width: 40px;
    height: 40px;
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
    width: 48px;
    height: 48px;
    background: var(--neon-accent-1);
    color: var(--bg-primary);
    border-color: var(--neon-accent-1);
  }

  .playback-btn:hover:not(:disabled) {
    border-color: var(--neon-accent-1);
    transform: scale(1.05);
  }

  .playback-btn.primary:hover:not(:disabled) {
    background: var(--color-success);
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

  .playback-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .time-display {
    color: var(--text-primary);
    font-family: monospace;
    font-size: 1rem;
    min-width: 100px;
  }

  .playback-controls-extended {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
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

  .tempo-controls {
    display: flex;
    gap: var(--spacing-md);
  }

  .tempo-controls label {
    color: var(--text-secondary);
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .tempo-slider,
  .pitch-slider {
    width: 60px;
    accent-color: var(--neon-accent-1);
  }

  .tempo-value,
  .pitch-value {
    font-family: monospace;
    min-width: 30px;
    text-align: center;
  }
</style> 