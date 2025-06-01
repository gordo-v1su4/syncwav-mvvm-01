<script lang="ts">
  import { uiStore, setAppMode } from '$lib/stores/uiStore';
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
</script>

<div class="mode-switcher" role="tablist" aria-label="Application modes">
  {#each modes as mode}
    <button
      class="mode-tab"
      class:active={currentMode === mode.key}
      role="tab"
      aria-selected={currentMode === mode.key}
      aria-controls="{mode.key}-panel"
      tabindex={currentMode === mode.key ? 0 : -1}
      on:click={() => handleModeSwitch(mode.key)}
      on:keydown={(e) => handleKeyDown(e, mode.key)}
    >
      [{mode.label}]
    </button>
  {/each}
</div>

<style>
  .mode-switcher {
    display: flex;
    background-color: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    padding: var(--spacing-sm);
    gap: var(--spacing-xs);
  }

  .mode-tab {
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-weight: 500;
    font-family: monospace;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    position: relative;
  }

  .mode-tab:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
    border-color: var(--neon-accent-1);
    transform: translateY(-1px);
  }

  .mode-tab.active {
    background: var(--bg-elevated);
    color: var(--neon-accent-1);
    border-color: var(--neon-accent-1);
    box-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
  }

  .mode-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--neon-accent-1);
    border-radius: 1px;
  }

  .mode-tab:focus {
    outline: 2px solid var(--neon-accent-1);
    outline-offset: 2px;
  }
</style> 