<script lang="ts">
  import { Upload, Music, Video } from 'svelte-lucide';
  import { uiStore, setAudioFile, addVideoFile } from '$lib/stores/uiStore';

  let audioFileInput: HTMLInputElement;
  let videoFileInput: HTMLInputElement;
  let audioProgress = 0;
  let videoProgress = 0;
  let isUploadingAudio = false;
  let isUploadingVideo = false;

  $: projectState = $uiStore.projectState;

  function triggerAudioUpload() {
    audioFileInput.click();
  }

  function triggerVideoUpload() {
    videoFileInput.click();
  }

  function handleAudioUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      simulateUpload(file, 'audio');
    }
  }

  function handleVideoUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      Array.from(files).forEach(file => {
        simulateUpload(file, 'video');
      });
    }
  }

  function simulateUpload(file: File, type: 'audio' | 'video') {
    if (type === 'audio') {
      isUploadingAudio = true;
      audioProgress = 0;
    } else {
      isUploadingVideo = true;
      videoProgress = 0;
    }

    const interval = setInterval(() => {
      if (type === 'audio') {
        audioProgress += 10;
        if (audioProgress >= 100) {
          clearInterval(interval);
          setAudioFile(file);
          isUploadingAudio = false;
          audioProgress = 0;
        }
      } else {
        videoProgress += 10;
        if (videoProgress >= 100) {
          clearInterval(interval);
          addVideoFile(file);
          isUploadingVideo = false;
          videoProgress = 0;
        }
      }
    }, 100);
  }

  function handleDrop(event: DragEvent, type: 'audio' | 'video') {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      if (type === 'audio' && files[0]) {
        simulateUpload(files[0], 'audio');
      } else if (type === 'video') {
        Array.from(files).forEach(file => {
          simulateUpload(file, 'video');
        });
      }
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }
</script>

<div class="setup-view">
  <div class="setup-header">
    <h1>Project Setup</h1>
    <p>Upload your master audio track and video clips to get started</p>
  </div>

  <div class="upload-section">
    <div class="upload-area-container">
      <!-- Audio Upload Area -->
      <div
        class="upload-area audio-upload"
        class:has-file={projectState.hasAudio}
        on:drop={(e) => handleDrop(e, 'audio')}
        on:dragover={handleDragOver}
        role="button"
        tabindex="0"
        on:click={triggerAudioUpload}
        on:keydown={(e) => e.key === 'Enter' && triggerAudioUpload()}
      >
        <div class="upload-content">
          <Music size={48} class="upload-icon" />
          <h3>Upload Master Audio</h3>
          <p>Drop your audio file here or click to browse</p>
          <span class="file-types">Supports MP3, WAV, M4A</span>
          {#if projectState.audioFile}
            <div class="file-info">
              <span class="file-name">{projectState.audioFile.name}</span>
            </div>
          {/if}
        </div>
        {#if isUploadingAudio}
          <div class="progress-bar">
            <div class="progress-fill" style="width: {audioProgress}%"></div>
          </div>
        {/if}
      </div>

      <!-- Video Upload Area -->
      <div
        class="upload-area video-upload"
        class:has-file={projectState.hasVideo}
        on:drop={(e) => handleDrop(e, 'video')}
        on:dragover={handleDragOver}
        role="button"
        tabindex="0"
        on:click={triggerVideoUpload}
        on:keydown={(e) => e.key === 'Enter' && triggerVideoUpload()}
      >
        <div class="upload-content">
          <Video size={48} class="upload-icon" />
          <h3>Upload Video Clips</h3>
          <p>Drop your video files here or click to browse</p>
          <span class="file-types">Supports MP4, MOV, WebM</span>
          {#if projectState.videoFiles.length > 0}
            <div class="file-info">
              <span class="file-count">{projectState.videoFiles.length} video{projectState.videoFiles.length > 1 ? 's' : ''} uploaded</span>
            </div>
          {/if}
        </div>
        {#if isUploadingVideo}
          <div class="progress-bar">
            <div class="progress-fill" style="width: {videoProgress}%"></div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Asset Library Preview -->
    <div class="asset-preview">
      <h3>Project Assets</h3>
      <p class="preview-note">Uploaded audio and video will appear here and in the EDIT mode Asset Library.</p>
      
      {#if projectState.hasAudio || projectState.hasVideo}
        <div class="asset-list">
          {#if projectState.audioFile}
            <div class="asset-item audio">
              <Music size={20} />
              <span>{projectState.audioFile.name}</span>
            </div>
          {/if}
          {#each projectState.videoFiles as videoFile}
            <div class="asset-item video">
              <Video size={20} />
              <span>{videoFile.name}</span>
            </div>
          {/each}
        </div>
      {:else}
        <div class="empty-state">
          <Upload size={32} />
          <p>No assets uploaded yet</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Hidden file inputs -->
<input
  bind:this={audioFileInput}
  type="file"
  accept="audio/*"
  on:change={handleAudioUpload}
  style="display: none"
/>

<input
  bind:this={videoFileInput}
  type="file"
  accept="video/*"
  multiple
  on:change={handleVideoUpload}
  style="display: none"
/>

<style>
  .setup-view {
    padding: var(--spacing-xl);
    height: 100%;
    overflow-y: auto;
  }

  .setup-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }

  .setup-header h1 {
    color: var(--neon-accent-1);
    margin-bottom: var(--spacing-sm);
  }

  .upload-section {
    max-width: 1200px;
    margin: 0 auto;
  }

  .upload-area-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
  }

  .upload-area {
    background: var(--bg-secondary);
    border: 2px dashed var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-normal);
    position: relative;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .upload-area:hover {
    border-color: var(--neon-accent-1);
    background: var(--bg-tertiary);
    transform: translateY(-2px);
  }

  .upload-area.has-file {
    border-color: var(--neon-accent-1);
    background: var(--bg-elevated);
  }

  .upload-content h3 {
    margin: var(--spacing-md) 0 var(--spacing-sm);
    color: var(--text-primary);
  }

  .upload-content p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
  }

  .file-types {
    font-size: 0.8rem;
    color: var(--text-dimmed);
  }

  :global(.upload-icon) {
    color: var(--neon-accent-1);
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--bg-tertiary);
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--neon-accent-1);
    transition: width var(--transition-fast);
  }

  .file-info {
    margin-top: var(--spacing-md);
    padding: var(--spacing-sm);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    border: 1px solid var(--neon-accent-1);
  }

  .file-name, .file-count {
    color: var(--neon-accent-1);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .asset-preview {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
  }

  .asset-preview h3 {
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
  }

  .preview-note {
    color: var(--text-dimmed);
    font-style: italic;
    margin-bottom: var(--spacing-lg);
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
    border: 1px solid var(--border-color);
  }

  .asset-item.audio :global(svg) {
    color: var(--neon-accent-1);
  }

  .asset-item.video :global(svg) {
    color: var(--neon-accent-2);
  }

  .empty-state {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--text-dimmed);
  }

  .empty-state :global(svg) {
    color: var(--text-dimmed);
    margin-bottom: var(--spacing-sm);
  }

  @media (max-width: 768px) {
    .upload-area-container {
      grid-template-columns: 1fr;
    }
  }
</style> 