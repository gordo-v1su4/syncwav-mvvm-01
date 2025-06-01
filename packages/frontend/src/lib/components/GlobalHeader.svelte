<script lang="ts">
  import { uiStore, setAppMode } from '$lib/stores/uiStore';
  import type { AppMode } from '$lib/types';

  export let showHomeButton = true;
  export let showSettingsButton = true;

  function navigateTo(mode: AppMode) {
    setAppMode(mode);
  }
</script>

<header class="global-header">
  <div class="header-left">
    {#if showHomeButton}
      <button 
        class="header-button"
        title="Home / Project Hub"
        aria-label="Go to Home / Project Hub"
        on:click={() => navigateTo('entry')}
      >
        <!-- Home icon SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span class="button-text">Home</span>
      </button>
    {/if}
  </div>

  <div class="header-center">
    <div class="app-version">
      <span class="app-env">DEV</span>
      <span class="app-version-number">v0.1.0</span>
    </div>
  </div>

  <div class="header-right">
    {#if showSettingsButton}
      <button 
        class="header-button"
        title="Application Settings"
        aria-label="Open application settings"
        on:click={() => navigateTo('settings')}
      >
        <!-- Settings icon SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        <span class="button-text">Settings</span>
      </button>
    {/if}
  </div>
</header>

<style>
  .global-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    height: 42px;
    min-height: 42px;
  }

  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .header-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 0.8rem;
  }

  .header-button:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
    border-color: var(--border-color);
  }

  .header-button:focus {
    outline: 2px solid var(--neon-accent-1);
    outline-offset: 2px;
  }

  .button-text {
    display: none;
  }

  .app-version {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 0.7rem;
    color: var(--text-dimmed);
  }

  .app-env {
    background-color: var(--neon-accent-2);
    color: var(--bg-primary);
    padding: 2px 4px;
    border-radius: var(--radius-xs);
    font-weight: bold;
  }

  .app-version-number {
    font-family: monospace;
  }

  /* Show text labels on larger screens */
  @media (min-width: 768px) {
    .button-text {
      display: inline;
    }
    
    .header-button {
      padding: var(--spacing-xs) var(--spacing-md);
    }
  }
</style>