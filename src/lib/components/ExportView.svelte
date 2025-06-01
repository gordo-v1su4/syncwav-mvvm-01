<script lang="ts">
  import { Download, Play, FileVideo } from 'svelte-lucide';

  let isExporting = false;
  let exportProgress = 0;
  let exportStatus = '';
  let exportComplete = false;
  let filename = 'artivus-export.mp4';

  const exportSteps = [
    'Preparing project...',
    'Analyzing audio markers...',
    'Processing video clips...',
    'Rendering frame 1 of 100...',
    'Rendering frame 25 of 100...',
    'Rendering frame 50 of 100...',
    'Rendering frame 75 of 100...',
    'Rendering frame 100 of 100...',
    'Encoding audio...',
    'Finalizing export...',
    'Export complete!'
  ];

  function startExport() {
    isExporting = true;
    exportProgress = 0;
    exportComplete = false;
    
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < exportSteps.length - 1) {
        exportStatus = exportSteps[stepIndex];
        exportProgress = (stepIndex / (exportSteps.length - 1)) * 100;
        stepIndex++;
      } else {
        exportStatus = exportSteps[stepIndex];
        exportProgress = 100;
        isExporting = false;
        exportComplete = true;
        clearInterval(stepInterval);
      }
    }, 800);
  }

  function downloadFile() {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = filename;
    link.click();
  }

  function previewExport() {
    // Simulate preview
    console.log('Opening preview...');
  }
</script>

<div class="export-view">
  <div class="export-header">
    <h1>Export Project</h1>
    <p>Render your synchronized audio-visual project for sharing</p>
  </div>

  <div class="export-content">
    <div class="export-settings">
      <h3>Export Settings</h3>
      
      <div class="setting-group">
        <label for="filename">Filename:</label>
        <input
          id="filename"
          type="text"
          bind:value={filename}
          disabled={isExporting}
        />
      </div>

      <div class="setting-group">
        <label for="format-select">Format:</label>
        <select id="format-select" disabled={isExporting}>
          <option value="mp4">MP4 (H.264)</option>
          <option value="webm">WebM</option>
        </select>
      </div>

      <div class="setting-group">
        <label for="quality-select">Quality:</label>
        <select id="quality-select" disabled={isExporting}>
          <option value="720p">720p (HD)</option>
          <option value="1080p">1080p (Full HD)</option>
        </select>
      </div>

      <div class="watermark-notice">
        <FileVideo size={20} />
        <span>Preview exports include Artivus Engine watermark</span>
      </div>
    </div>

    <div class="export-actions">
      {#if !isExporting && !exportComplete}
        <button
          class="export-button primary"
          on:click={startExport}
        >
          <Play size={20} />
          Start Export
        </button>
      {:else if isExporting}
        <div class="export-progress">
          <div class="progress-info">
            <h4>Exporting...</h4>
            <p class="progress-status">{exportStatus}</p>
          </div>
          
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                style="width: {exportProgress}%"
              ></div>
            </div>
            <span class="progress-percentage">{Math.round(exportProgress)}%</span>
          </div>
        </div>
      {:else if exportComplete}
        <div class="export-complete">
          <div class="complete-info">
            <h4 class="success">Export Complete!</h4>
            <p>Your synchronized audio-visual project is ready</p>
          </div>
          
          <div class="complete-actions">
            <button
              class="download-button primary"
              on:click={downloadFile}
            >
              <Download size={20} />
              Download {filename}
            </button>
            
            <button
              class="preview-button secondary"
              on:click={previewExport}
            >
              <Play size={20} />
              Preview
            </button>
          </div>
          
          <button
            class="new-export-button"
            on:click={() => { exportComplete = false; exportProgress = 0; }}
          >
            Export Another Version
          </button>
        </div>
      {/if}
    </div>

    <div class="export-info">
      <h4>Export Information</h4>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Processing:</span>
          <span class="info-value">Client-side (in browser)</span>
        </div>
        <div class="info-item">
          <span class="info-label">Audio:</span>
          <span class="info-value">Synchronized with video cuts and effects</span>
        </div>
        <div class="info-item">
          <span class="info-label">Video:</span>
          <span class="info-value">Includes all timeline edits and visual effects</span>
        </div>
        <div class="info-item">
          <span class="info-label">Watermark:</span>
          <span class="info-value">Artivus Engine logo (preview version)</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .export-view {
    padding: var(--spacing-xl);
    height: 100%;
    overflow-y: auto;
    max-width: 800px;
    margin: 0 auto;
  }

  .export-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }

  .export-header h1 {
    color: var(--neon-accent-2);
    margin-bottom: var(--spacing-sm);
  }

  .export-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .export-settings {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
  }

  .export-settings h3 {
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
  }

  .setting-group {
    margin-bottom: var(--spacing-lg);
  }

  .setting-group label {
    display: block;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
  }

  .setting-group input,
  .setting-group select {
    width: 100%;
    max-width: 300px;
  }

  .watermark-notice {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .watermark-notice :global(svg) {
    color: var(--neon-accent-2);
  }

  .export-actions {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
  }

  .export-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    background: var(--neon-accent-2);
    color: var(--bg-primary);
    border: none;
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-md);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    box-shadow: 0 0 16px rgba(255, 107, 53, 0.3);
  }

  .export-button:hover {
    background: var(--neon-accent-1);
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
    transform: translateY(-2px);
  }

  .export-progress {
    text-align: center;
  }

  .progress-info h4 {
    color: var(--neon-accent-1);
    margin-bottom: var(--spacing-sm);
  }

  .progress-status {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
    font-style: italic;
  }

  .progress-bar-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .progress-bar {
    flex: 1;
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--neon-accent-1), var(--neon-accent-2));
    transition: width var(--transition-fast);
  }

  .progress-percentage {
    color: var(--neon-accent-1);
    font-weight: 600;
    min-width: 50px;
  }

  .export-complete {
    text-align: center;
  }

  .complete-info h4 {
    color: var(--color-success);
    margin-bottom: var(--spacing-sm);
  }

  .complete-info p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
  }

  .complete-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    margin-bottom: var(--spacing-lg);
  }

  .download-button,
  .preview-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .download-button {
    background: var(--neon-accent-1);
    color: var(--bg-primary);
    border: none;
  }

  .download-button:hover {
    background: var(--neon-accent-2);
    transform: translateY(-1px);
  }

  .preview-button {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .preview-button:hover {
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
  }

  .new-export-button {
    background: none;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .new-export-button:hover {
    color: var(--text-primary);
    border-color: var(--neon-accent-1);
  }

  .export-info {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
  }

  .export-info h4 {
    color: var(--text-primary);
    margin-bottom: var(--spacing-lg);
  }

  .info-grid {
    display: grid;
    gap: var(--spacing-md);
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--border-color);
  }

  .info-item:last-child {
    border-bottom: none;
  }

  .info-label {
    color: var(--text-secondary);
    font-weight: 500;
  }

  .info-value {
    color: var(--text-primary);
    text-align: right;
  }

  @media (max-width: 768px) {
    .complete-actions {
      flex-direction: column;
      align-items: center;
    }

    .download-button,
    .preview-button {
      width: 100%;
      max-width: 250px;
      justify-content: center;
    }
  }
</style> 