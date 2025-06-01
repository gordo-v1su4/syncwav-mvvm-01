<script lang="ts">
  import { uiStore, setAppMode } from '$lib/stores/uiStore';
  import { House, Settings, User } from 'svelte-lucide';
  import type { AppMode } from '$lib/types';

  const modes: { key: AppMode; label: string }[] = [
    { key: 'setup', label: 'SETUP' },
    { key: 'edit', label: 'EDIT' },
    { key: 'export', label: 'EXPORT' }
  ];

  $: currentMode = $uiStore.currentAppMode;

  function handleModeSwitch(mode: AppMode) {
    setAppMode(mode);
  }

  function handleKeyDown(event: KeyboardEvent, mode: AppMode) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleModeSwitch(mode);
    }
  }

  // Keyboard shortcuts for mode switching
  function handleGlobalKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case '1':
          event.preventDefault();
          handleModeSwitch('setup');
          break;
        case '2':
          event.preventDefault();
          handleModeSwitch('edit');
          break;
        case '3':
          event.preventDefault();
          handleModeSwitch('export');
          break;
      }
    }
  }
</script>

<svelte:window on:keydown={handleGlobalKeyDown} />

<nav class="top-bar" aria-label="Main navigation">
  <!-- Brand Identity Section -->
  <div class="brand-section">
    <h1 class="brand-wordmark">
      <span class="brand-artivus">ARTIVUS</span>
      <span class="brand-engine">ENGINE</span>
    </h1>
  </div>

  <!-- Mode Switcher (Center Focus) -->
  <div class="mode-switcher" role="tablist" aria-label="Application modes">
    {#each modes as mode}
      <button
        class="mode-tab"
        class:active={currentMode === mode.key}
        role="tab"
        aria-selected={currentMode === mode.key}
        aria-controls="{mode.key}-panel"
        tabindex={currentMode === mode.key ? 0 : -1}
        title="Switch to {mode.label} mode (Ctrl+{modes.indexOf(mode) + 1})"
        on:click={() => handleModeSwitch(mode.key)}
        on:keydown={(e) => handleKeyDown(e, mode.key)}
      >
        [{mode.label}]
      </button>
    {/each}
  </div>

  <!-- Global Actions (Right Aligned) -->
  <div class="global-actions">
    <button class="action-button" title="Project Home" aria-label="Go to project home">
      <House size={18} />
    </button>
    <button class="action-button" title="Settings" aria-label="Open settings">
      <Settings size={18} />
    </button>
    <button class="action-button" title="User Account" aria-label="User account">
      <User size={18} />
    </button>
  </div>
</nav>

<style>
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    padding: var(--spacing-sm) var(--spacing-lg);
    height: 60px;
    min-height: 60px;
  }

  /* Brand Identity Section */
  .brand-section {
    flex: 0 0 auto;
  }

  .brand-wordmark {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 1px;
    display: flex;
    align-items: baseline;
    gap: var(--spacing-xs);
  }

  .brand-artivus {
    color: var(--text-primary);
  }

  .brand-engine {
    color: var(--neon-accent-warm, var(--neon-accent-2));
    font-size: 0.9em;
    font-weight: 500;
  }

  /* Mode Switcher (Center Focus) */
  .mode-switcher {
    display: flex;
    gap: var(--spacing-xs);
    flex: 1;
    justify-content: center;
    max-width: 400px;
    margin: 0 var(--spacing-lg);
  }

  .mode-tab {
    padding: var(--spacing-sm) var(--spacing-lg);
    background: transparent;
    color: var(--text-secondary);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-weight: 500;
    font-family: monospace;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    position: relative;
    font-size: 0.9rem;
    min-width: 80px;
  }

  .mode-tab:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
    transform: translateY(-1px);
  }

  .mode-tab.active {
    color: var(--text-primary);
    background: var(--bg-elevated);
    position: relative;
  }

  .mode-tab.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    background: var(--neon-accent-1);
    border-radius: 1px;
  }

  .mode-tab:focus {
    outline: 2px solid var(--neon-accent-1);
    outline-offset: 2px;
  }

  /* Global Actions (Right Aligned) */
  .global-actions {
    display: flex;
    gap: var(--spacing-sm);
    flex: 0 0 auto;
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .action-button:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
    border-color: var(--neon-accent-1);
  }

  .action-button:focus {
    outline: 2px solid var(--neon-accent-1);
    outline-offset: 2px;
  }
</style> 