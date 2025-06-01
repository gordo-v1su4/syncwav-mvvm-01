<script lang="ts">
  import { uiStore, toggleLeftPanel, toggleRightPanel } from '$lib/stores/uiStore';
  import { ChevronLeft, ChevronRight, Settings, Library } from 'svelte-lucide';

  $: panelStates = $uiStore.panelStates;
</script>

<div class="edit-view">
  <!-- Top: Master Waveform Display Row -->
  <div class="waveform-section">
    <div class="waveform-placeholder">
      <h3>Master Waveform Display</h3>
      <p>Interactive audio waveform with markers, playhead, and zoom controls will be implemented here</p>
    </div>
  </div>

  <!-- Main Content Area -->
  <div class="main-content">
    <!-- Left Side Panel: Project Asset Library -->
    <div class="side-panel left-panel" class:collapsed={panelStates.leftPanelCollapsed}>
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
        <p>Project assets will be displayed here with drag-and-drop functionality to the timeline</p>
      </div>
    </div>

    <!-- Center: Video Preview + Timeline -->
    <div class="center-content">
      <!-- Top-Center: Video Preview Area -->
      <div class="video-preview-section">
        <div class="video-placeholder">
          <h4>Video Preview</h4>
          <p>WebGL2 canvas for video rendering with effects will be here</p>
        </div>
      </div>

      <!-- Bottom: Interactive Video Timeline -->
      <div class="timeline-section">
        <div class="timeline-placeholder">
          <h4>Interactive Video Timeline</h4>
          <p>Drag-and-drop video sequence with clip trimming and synchronization controls</p>
        </div>
      </div>

      <!-- Integrated Master Playback Controls -->
      <div class="playback-controls">
        <div class="playback-placeholder">
          <button>⏮</button>
          <button>⏸</button>
          <button>⏵</button>
          <button>⏭</button>
          <span>Playback Controls</span>
        </div>
      </div>
    </div>

    <!-- Right Side Panel: Contextual Controls -->
    <div class="side-panel right-panel" class:collapsed={panelStates.rightPanelCollapsed}>
      <div class="panel-header">
        <Settings size={20} />
        <h4>Controls</h4>
        <button class="panel-toggle" on:click={toggleRightPanel} aria-label="Toggle controls panel">
          {#if panelStates.rightPanelCollapsed}
            <ChevronLeft size={16} />
          {:else}
            <ChevronRight size={16} />
          {/if}
        </button>
      </div>
      <div class="panel-content">
        <div class="control-tabs">
          <button class="control-tab active">Audio Analysis</button>
          <button class="control-tab">Markers</button>
          <button class="control-tab">Sync Rules</button>
          <button class="control-tab">Effects</button>
        </div>
        <div class="control-content">
          <p>Contextual controls for audio analysis, markers, synchronization rules, and effects parameters</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .edit-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
  }

  .waveform-section {
    height: 150px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
  }

  .waveform-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--text-secondary);
    text-align: center;
  }

  .waveform-placeholder h3 {
    color: var(--neon-accent-1);
    margin-bottom: var(--spacing-sm);
  }

  .main-content {
    flex: 1;
    display: flex;
    min-height: 0;
  }

  .side-panel {
    width: 300px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    transition: width var(--transition-normal);
  }

  .side-panel.collapsed {
    width: 40px;
  }

  .side-panel.right-panel {
    border-right: none;
    border-left: 1px solid var(--border-color);
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-tertiary);
  }

  .panel-header h4 {
    flex: 1;
    margin: 0;
    color: var(--text-primary);
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

  .center-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .video-preview-section {
    height: 300px;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
  }

  .video-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--text-secondary);
    text-align: center;
  }

  .video-placeholder h4 {
    color: var(--neon-accent-2);
    margin-bottom: var(--spacing-sm);
  }

  .timeline-section {
    flex: 1;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    min-height: 150px;
  }

  .timeline-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--text-secondary);
    text-align: center;
  }

  .timeline-placeholder h4 {
    color: var(--neon-accent-3);
    margin-bottom: var(--spacing-sm);
  }

  .playback-controls {
    height: 60px;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
  }

  .playback-placeholder {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    color: var(--text-secondary);
  }

  .playback-placeholder button {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 1.2rem;
  }

  .playback-placeholder button:hover {
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
  }

  .control-tabs {
    display: flex;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-md);
    flex-wrap: wrap;
  }

  .control-tab {
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.8rem;
    transition: all var(--transition-fast);
  }

  .control-tab:hover {
    border-color: var(--neon-accent-1);
    color: var(--text-primary);
  }

  .control-tab.active {
    background: var(--neon-accent-1);
    color: var(--bg-primary);
    border-color: var(--neon-accent-1);
  }

  .control-content {
    color: var(--text-secondary);
  }
</style> 