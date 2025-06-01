<script lang="ts">
  import { audioEngineStore, setAnalysisProgress } from '$lib/stores/audioEngineStore';
  import { detectBeats, detectTransients } from '$lib/wasm';
  import { generateId } from '$lib/utils/audioUtils';

  let isDetectingBeats = false;
  let isDetectingTransients = false;
  let isIsolatingStem = false;

  // Handle beat detection
  async function handleDetectBeats() {
    if (!$audioEngineStore.audioBuffer || isDetectingBeats) return;
    
    try {
      isDetectingBeats = true;
      setAnalysisProgress('beatDetection', 0.1);
      
      // Update UI to show progress
      const updateProgress = setInterval(() => {
        const currentProgress = $audioEngineStore.analysisProgress.beatDetection;
        if (currentProgress < 0.9) {
          setAnalysisProgress('beatDetection', currentProgress + 0.1);
        }
      }, 200);
      
      // Use WASM module to detect beats
      const beatTimestamps = await detectBeats($audioEngineStore.audioBuffer);
      
      // Create markers from timestamps
      const beatMarkers = beatTimestamps.map(time => ({
        id: generateId('beat'),
        type: 'beat' as const,
        time,
        label: `Beat ${Math.round(time * 10) / 10}s`,
        color: '#00ff88' // neon-accent-1
      }));
      
      // Update store with new markers
      audioEngineStore.update(state => ({
        ...state,
        markers: [
          ...state.markers.filter(m => m.type !== 'beat'),
          ...beatMarkers
        ].sort((a, b) => a.time - b.time)
      }));
      
      clearInterval(updateProgress);
      setAnalysisProgress('beatDetection', 1);
      
      // Reset progress after a delay
      setTimeout(() => {
        setAnalysisProgress('beatDetection', 0);
      }, 2000);
      
    } catch (error) {
      console.error('Error detecting beats:', error);
    } finally {
      isDetectingBeats = false;
    }
  }

  // Handle transient detection
  async function handleDetectTransients() {
    if (!$audioEngineStore.audioBuffer || isDetectingTransients) return;
    
    try {
      isDetectingTransients = true;
      setAnalysisProgress('transientDetection', 0.1);
      
      // Update UI to show progress
      const updateProgress = setInterval(() => {
        const currentProgress = $audioEngineStore.analysisProgress.transientDetection;
        if (currentProgress < 0.9) {
          setAnalysisProgress('transientDetection', currentProgress + 0.1);
        }
      }, 200);
      
      // Use WASM module to detect transients
      const transientTimestamps = await detectTransients($audioEngineStore.audioBuffer);
      
      // Create markers from timestamps
      const transientMarkers = transientTimestamps.map(time => ({
        id: generateId('transient'),
        type: 'transient' as const,
        time,
        label: `T ${Math.round(time * 10) / 10}s`,
        color: '#ff6b35' // neon-accent-2
      }));
      
      // Update store with new markers
      audioEngineStore.update(state => ({
        ...state,
        markers: [
          ...state.markers.filter(m => m.type !== 'transient'),
          ...transientMarkers
        ].sort((a, b) => a.time - b.time)
      }));
      
      clearInterval(updateProgress);
      setAnalysisProgress('transientDetection', 1);
      
      // Reset progress after a delay
      setTimeout(() => {
        setAnalysisProgress('transientDetection', 0);
      }, 2000);
      
    } catch (error) {
      console.error('Error detecting transients:', error);
    } finally {
      isDetectingTransients = false;
    }
  }

  // Handle stem isolation (placeholder)
  function handleIsolateStems() {
    alert("Stem isolation is not yet implemented in this version");
  }

  // Clear all analysis markers
  function clearAllMarkers() {
    audioEngineStore.update(state => ({
      ...state,
      markers: state.markers.filter(m => m.type === 'user') // Keep only user-defined markers
    }));
  }

  // Add custom marker at current playback position
  function addCustomMarker() {
    const currentTime = $audioEngineStore.currentTime;
    
    const customMarker = {
      id: generateId('user'),
      type: 'user' as const,
      time: currentTime,
      label: `M ${Math.round(currentTime * 10) / 10}s`,
      color: '#00d4ff' // neon-accent-3
    };
    
    audioEngineStore.update(state => ({
      ...state,
      markers: [...state.markers, customMarker].sort((a, b) => a.time - b.time)
    }));
  }
</script>

<div class="analysis-controls">
  <div class="section-header">
    <h3>Audio Analysis</h3>
  </div>
  
  <!-- Analysis progress indicators -->
  {#if $audioEngineStore.analysisProgress.beatDetection > 0 || $audioEngineStore.analysisProgress.transientDetection > 0 || $audioEngineStore.analysisProgress.stemIsolation > 0}
    <div class="progress-indicators">
      {#if $audioEngineStore.analysisProgress.beatDetection > 0}
        <div class="progress-item">
          <span>Beat Detection</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: {$audioEngineStore.analysisProgress.beatDetection * 100}%"></div>
          </div>
          <span class="progress-percent">{Math.round($audioEngineStore.analysisProgress.beatDetection * 100)}%</span>
        </div>
      {/if}
      
      {#if $audioEngineStore.analysisProgress.transientDetection > 0}
        <div class="progress-item">
          <span>Transient Detection</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: {$audioEngineStore.analysisProgress.transientDetection * 100}%"></div>
          </div>
          <span class="progress-percent">{Math.round($audioEngineStore.analysisProgress.transientDetection * 100)}%</span>
        </div>
      {/if}
      
      {#if $audioEngineStore.analysisProgress.stemIsolation > 0}
        <div class="progress-item">
          <span>Stem Isolation</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: {$audioEngineStore.analysisProgress.stemIsolation * 100}%"></div>
          </div>
          <span class="progress-percent">{Math.round($audioEngineStore.analysisProgress.stemIsolation * 100)}%</span>
        </div>
      {/if}
    </div>
  {/if}
  
  <div class="control-group">
    <h4>Rhythmic Analysis</h4>
    <button 
      class="analysis-btn" 
      on:click={handleDetectBeats} 
      disabled={!$audioEngineStore.audioBuffer || isDetectingBeats}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 12h6"></path>
        <path d="M22 12h-6"></path>
        <path d="M12 2v2"></path>
        <path d="M12 8v2"></path>
        <path d="M12 14v2"></path>
        <path d="M12 20v2"></path>
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
      Detect Master Beats
    </button>
    
    <button 
      class="analysis-btn" 
      on:click={handleDetectTransients} 
      disabled={!$audioEngineStore.audioBuffer || isDetectingTransients}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
      Detect Transients
    </button>
  </div>
  
  <div class="control-group">
    <h4>Stem Control</h4>
    <button 
      class="analysis-btn" 
      on:click={handleIsolateStems} 
      disabled={!$audioEngineStore.audioBuffer || isIsolatingStem}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"></path>
        <path d="M2 13h10"></path>
        <path d="M9 16l-3-3 3-3"></path>
      </svg>
      Isolate Audio Stems
      <span class="coming-soon-badge">Coming Soon</span>
    </button>
    
    <!-- Placeholder for future stem controls -->
    <div class="stem-controls-placeholder">
      <p class="info-text">Stem separation allows analyzing vocals, drums, and other elements separately.</p>
    </div>
  </div>
  
  <div class="control-group">
    <h4>Custom Markers</h4>
    <button 
      class="analysis-btn" 
      on:click={addCustomMarker} 
      disabled={!$audioEngineStore.audioBuffer}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      Add Marker at Current Position
    </button>
    
    <button 
      class="analysis-btn danger" 
      on:click={clearAllMarkers} 
      disabled={$audioEngineStore.markers.length === 0}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
      Clear All Markers
    </button>
  </div>
  
  <div class="marker-stats">
    <h4>Marker Statistics</h4>
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">Beats</span>
        <span class="stat-value beat">{$audioEngineStore.markers.filter(m => m.type === 'beat').length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Transients</span>
        <span class="stat-value transient">{$audioEngineStore.markers.filter(m => m.type === 'transient').length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Custom</span>
        <span class="stat-value custom">{$audioEngineStore.markers.filter(m => m.type === 'user').length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total</span>
        <span class="stat-value">{$audioEngineStore.markers.length}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .analysis-controls {
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    height: 100%;
    overflow-y: auto;
  }

  .section-header h3 {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--neon-accent-1);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: var(--spacing-sm);
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .control-group h4 {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .analysis-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
  }

  .analysis-btn:hover:not(:disabled) {
    background: var(--bg-elevated);
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
  }

  .analysis-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .analysis-btn.danger:hover:not(:disabled) {
    border-color: var(--color-error);
    color: var(--color-error);
  }

  .coming-soon-badge {
    position: absolute;
    right: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.7rem;
    background: var(--neon-accent-3);
    color: var(--bg-primary);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    opacity: 0.8;
  }

  .progress-indicators {
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  .progress-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.8rem;
  }

  .progress-bar {
    flex: 1;
    height: 6px;
    background: var(--bg-secondary);
    border-radius: var(--radius-pill);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--neon-accent-1);
    border-radius: var(--radius-pill);
    transition: width 0.3s ease;
  }

  .progress-percent {
    min-width: 40px;
    text-align: right;
    font-family: monospace;
  }

  .stem-controls-placeholder {
    padding: var(--spacing-sm);
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    border: 1px dashed var(--border-color);
  }

  .info-text {
    font-size: 0.8rem;
    color: var(--text-dimmed);
    font-style: italic;
    margin: 0;
  }

  .marker-stats {
    margin-top: auto;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--border-color);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }

  .stat-item {
    background: var(--bg-tertiary);
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .stat-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .stat-value.beat {
    color: var(--neon-accent-1);
  }

  .stat-value.transient {
    color: var(--neon-accent-2);
  }

  .stat-value.custom {
    color: var(--neon-accent-3);
  }
</style>