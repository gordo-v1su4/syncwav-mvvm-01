<script lang="ts">
  import { uiStore, toggleLeftPanel, toggleRightPanel } from '$lib/stores/uiStore';
  import { ChevronLeft, ChevronRight, Settings, Library, Play, Pause, Square, SkipBack, SkipForward } from 'svelte-lucide';

  $: panelStates = $uiStore.panelStates;
</script>

<div class="main-workspace">
  <!-- Master Waveform Display Row -->
  <div class="waveform-display" style="grid-area: waveform;">
    <div class="waveform-container">
      <h3>Master Waveform Display</h3>
      <p>Interactive audio waveform with markers, sections, and time ruler</p>
      <div class="waveform-controls">
        <button class="zoom-btn" title="Zoom out">−</button>
        <button class="zoom-btn" title="Zoom in">+</button>
      </div>
    </div>
  </div>

  <!-- Left Side Panel: Asset Library -->
  <div class="asset-panel" style="grid-area: asset-panel;" class:collapsed={panelStates.leftPanelCollapsed}>
    <div class="panel-header">
      <Library size={20} />
      <h4>Asset Library</h4>
      <button class="panel-toggle" on:click={toggleLeftPanel} aria-label="Toggle asset library panel">
        {#if panelStates.leftPanelCollapsed}
          <ChevronRight size={16} />
        {:else}
          <ChevronLeft size={16} />
        {/if}
      </button>
    </div>
    <div class="panel-content">
      <div class="asset-section">
        <h5>Video Clips</h5>
        <div class="asset-list">
          <div class="asset-item">
            <div class="asset-thumbnail"></div>
            <span>clip1.mp4</span>
          </div>
          <div class="asset-item">
            <div class="asset-thumbnail"></div>
            <span>clip2.mp4</span>
          </div>
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
          <span class="video-status">Preview: Ready</span>
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
        <div class="clip-block selected" style="left: 10%; width: 20%;">
          <span class="clip-name">clip1.mp4</span>
        </div>
        <div class="clip-block playing" style="left: 35%; width: 15%;">
          <span class="clip-name">clip2.mp4</span>
        </div>
      </div>
      <div class="timeline-ruler">
        <div class="time-marker" style="left: 0%;">0:00</div>
        <div class="time-marker" style="left: 25%;">0:30</div>
        <div class="time-marker" style="left: 50%;">1:00</div>
        <div class="time-marker" style="left: 75%;">1:30</div>
      </div>
    </div>
  </div>

  <!-- Right Side Panel: Audio-Driven Control Panel -->
  <div class="control-panel" style="grid-area: control-panel;" class:collapsed={panelStates.rightPanelCollapsed}>
    <div class="panel-header">
      <Settings size={20} />
      <h4>Audio-Visual Controls</h4>
      <button class="panel-toggle" on:click={toggleRightPanel} aria-label="Toggle control panel">
        {#if panelStates.rightPanelCollapsed}
          <ChevronLeft size={16} />
        {:else}
          <ChevronRight size={16} />
        {/if}
      </button>
    </div>
    <div class="panel-content">
      <!-- Default State: Audio Analysis Tools -->
      <div class="control-section">
        <h5>Audio Analysis</h5>
        <div class="analysis-tools">
          <button class="analysis-btn">Detect Master Beats</button>
          <button class="analysis-btn">Isolate Stems</button>
          <button class="analysis-btn">Detect Transients</button>
          <button class="analysis-btn toggle" class:active={false}>Manual Marker Mode</button>
        </div>
      </div>

      <!-- Stem Controls Section -->
      <div class="control-section">
        <h5>Stem Controls</h5>
        <div class="stem-controls">
          <div class="stem-item">
            <span>Vocals</span>
            <button class="stem-solo">Solo</button>
            <button class="stem-detect">Detect</button>
          </div>
          <div class="stem-item">
            <span>Drums</span>
            <button class="stem-solo">Solo</button>
            <button class="stem-detect">Detect</button>
          </div>
        </div>
      </div>

      <!-- Synchronization Rules Section -->
      <div class="control-section">
        <h5>Sync Rules</h5>
        <div class="sync-controls">
          <label>
            Driving Audio Feature:
            <select class="sync-select">
              <option>Master Beats</option>
              <option>Vocal Transients</option>
              <option>Drum Transients</option>
            </select>
          </label>
          <label>
            Switch every:
            <input type="number" value="4" min="1" class="sync-input"> markers
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- Master Playback Controls -->
  <div class="playback-controls" style="grid-area: playback;">
    <div class="playback-main">
      <button class="playback-btn secondary"><SkipBack size={18} /></button>
      <button class="playback-btn primary"><Play size={20} /></button>
      <button class="playback-btn secondary"><Square size={16} /></button>
      <button class="playback-btn secondary"><SkipForward size={18} /></button>
    </div>
    <div class="playback-info">
      <span class="time-display">00:00 / 03:24</span>
      <div class="tempo-controls">
        <label>BPM: <input type="range" min="60" max="180" value="120" class="tempo-slider"></label>
        <label>Pitch: <input type="range" min="-12" max="12" value="0" class="pitch-slider"></label>
      </div>
    </div>
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

  .waveform-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--text-secondary);
    text-align: center;
    position: relative;
  }

  .waveform-container h3 {
    color: var(--neon-accent-1);
    margin-bottom: var(--spacing-sm);
  }

  .waveform-controls {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    display: flex;
    gap: var(--spacing-xs);
  }

  .zoom-btn {
    width: 32px;
    height: 32px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .zoom-btn:hover {
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
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

  .panel-toggle {
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

  .panel-toggle:hover {
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
  }

  .asset-item:hover {
    background: var(--hover-bg);
    transform: translateY(-1px);
  }

  .asset-thumbnail {
    width: 32px;
    height: 18px;
    background: var(--bg-primary);
    border-radius: var(--radius-sm);
    flex-shrink: 0;
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
  }

  .clip-block.selected {
    border: 2px solid var(--neon-accent-1);
  }

  .clip-block.playing {
    border: 2px solid var(--neon-accent-2);
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
  }

  .analysis-btn:hover {
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
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
  }

  .stem-solo:hover,
  .stem-detect:hover {
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
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

  .playback-btn:hover {
    border-color: var(--neon-accent-1);
    transform: scale(1.05);
  }

  .playback-btn.primary:hover {
    background: var(--neon-accent-1);
    transform: scale(1.1);
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
    width: 80px;
    accent-color: var(--neon-accent-1);
  }
</style> 