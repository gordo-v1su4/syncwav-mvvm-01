<script lang="ts">
  import '../app.css';
  import ModeSwitcher from '$lib/components/ModeSwitcher.svelte';
  import GlobalHeader from '$lib/components/GlobalHeader.svelte';
  import AppEntryHubView from '$lib/components/AppEntryHubView.svelte';
  import ProjectMediaManagementView from '$lib/components/ProjectMediaManagementView.svelte';
  import MainEditingInterfaceView from '$lib/components/MainEditingInterfaceView.svelte';
  import ExportView from '$lib/components/ExportView.svelte';
  import ApplicationSettingsView from '$lib/components/ApplicationSettingsView.svelte';
  import { uiStore } from '$lib/stores/uiStore';

  $: currentMode = $uiStore.currentAppMode;
</script>

<div class="app-shell">
  <ModeSwitcher />
  <GlobalHeader />
  
  <main class="main-content">
    {#if currentMode === 'entry'}
      <div id="entry-panel" role="tabpanel" aria-labelledby="entry-tab">
        <AppEntryHubView />
      </div>
    {:else if currentMode === 'setup'}
      <div id="setup-panel" role="tabpanel" aria-labelledby="setup-tab">
        <ProjectMediaManagementView />
      </div>
    {:else if currentMode === 'edit'}
      <div id="edit-panel" role="tabpanel" aria-labelledby="edit-tab">
        <MainEditingInterfaceView />
      </div>
    {:else if currentMode === 'export'}
      <div id="export-panel" role="tabpanel" aria-labelledby="export-tab">
        <ExportView />
      </div>
    {:else if currentMode === 'settings'}
      <div id="settings-panel" role="tabpanel" aria-labelledby="settings-tab">
        <ApplicationSettingsView />
      </div>
    {/if}
  </main>
  
  <slot />
</div>

<div class="desktop-only-message">
  <p>Artivus Engine is best viewed on a desktop browser.</p>
  <p>Please access on a larger screen for the optimal experience.</p>
</div>

<style>
  .app-shell {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .main-content {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .main-content > div {
    height: 100%;
  }
  
  .desktop-only-message {
    display: none;
  }
  
  /* Only show the mobile warning on smaller screens */
  @media (max-width: 768px) {
    .app-shell {
      display: none;
    }
    
    .desktop-only-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      padding: var(--spacing-lg);
      text-align: center;
      background: var(--bg-primary);
      color: var(--text-primary);
    }
    
    .desktop-only-message p {
      margin: var(--spacing-sm) 0;
    }
  }
</style>