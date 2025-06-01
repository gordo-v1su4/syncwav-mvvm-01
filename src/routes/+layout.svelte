<script lang="ts">
  import '../app.css';
  import ModeSwitcher from '$lib/components/ModeSwitcher.svelte';
  import ProjectMediaManagementView from '$lib/components/ProjectMediaManagementView.svelte';
  import MainEditingInterfaceView from '$lib/components/MainEditingInterfaceView.svelte';
  import ExportView from '$lib/components/ExportView.svelte';
  import { uiStore } from '$lib/stores/uiStore';

  $: currentMode = $uiStore.currentAppMode;
</script>

<div class="app-shell">
  <ModeSwitcher />
  
  <main class="main-content">
    {#if currentMode === 'setup'}
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
    {/if}
  </main>
  
  <slot />
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
</style> 