<script lang="ts">
  import { setAppMode } from '$lib/stores/uiStore';
  import { resetProject } from '$lib/stores/projectStore';

  function createNewProject() {
    // Reset project store or initialize new project state
    resetProject();
    setAppMode('setup'); // Navigate to SETUP mode
  }

  function openExistingProject() {
    // TODO: Implement file picker or project selection logic
    // For now, placeholder functionality
    console.log('Open existing project functionality to be implemented');
  }
</script>

<div class="app-entry-hub-view">
  <div class="app-entry-content">
    <div class="logo-area">
      <h1 class="engine-logo">
        <span class="logo-artivus">ARTIVUS</span>
        <span class="logo-engine">ENGINE</span>
      </h1>
      <p class="tagline">Audio-Driven Visual Synchronization</p>
    </div>
    
    <div class="action-buttons">
      <button on:click={createNewProject} class="btn-primary">
        <!-- Plus icon SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Create New Project</span>
      </button>
      
      <button class="btn-secondary">
        <!-- Folder Open icon SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1"></path>
          <path d="M15 4h.01"></path>
          <path d="M4 12h6.01"></path>
          <path d="M20 15v-3a2 2 0 0 0-2-2H2"></path>
          <path d="M18 13v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5"></path>
        </svg>
        <span>Open Existing Project</span>
      </button>
    </div>
    
    <div class="version-info">
      <span>Version {version} (Development Build)</span>
    </div>
  </div>
</div>

<style>
  .app-entry-hub-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background: linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary));
    padding: var(--spacing-xl);
  }

  .app-entry-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xl);
    max-width: 600px;
    text-align: center;
  }

  .logo-area {
    margin-bottom: var(--spacing-xl);
  }

  .engine-logo {
    font-size: 3.5rem;
    margin-bottom: var(--spacing-md);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo-artivus {
    color: var(--text-primary);
    font-weight: 700;
    letter-spacing: 4px;
  }

  .logo-engine {
    color: var(--neon-accent-1);
    font-size: 0.5em;
    letter-spacing: 8px;
    font-weight: 400;
    margin-top: var(--spacing-xs);
  }

  .tagline {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-top: var(--spacing-sm);
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    width: 100%;
    max-width: 320px;
  }

  .btn-primary, .btn-secondary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: 1rem;
    border-radius: var(--radius-md);
    transition: all var(--transition-normal);
    width: 100%;
  }

  .btn-primary {
    background: var(--neon-accent-1);
    color: var(--bg-primary);
    border: none;
    font-weight: 600;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px var(--neon-accent-1);
  }

  .btn-secondary {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .btn-secondary:hover {
    border-color: var(--neon-accent-1);
    color: var(--neon-accent-1);
  }

  .version-info {
    margin-top: var(--spacing-xl);
    color: var(--text-dimmed);
    font-size: 0.8rem;
  }
</style>  }
</style>