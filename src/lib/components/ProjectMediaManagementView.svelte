<script lang="ts">
  import { Upload, Music, Video, CircleCheck, CircleAlert } from 'svelte-lucide';
  import { uiStore, setAudioFile, addVideoFile, setAppMode } from '$lib/stores/uiStore';
  import { audioEngineStore } from '$lib/stores/audioEngineStore';
  import { projectStore, addVideoClip, setAudioAsset, updateProjectSettings } from '$lib/stores/projectStore';
  import { loadAudioFromFile } from '$lib/utils/audioService';
  import { isValidAudioFile, isValidVideoFile } from '$lib/utils/audioUtils';

  let audioFileInput: HTMLInputElement;
  let videoFileInput: HTMLInputElement;
  let audioProgress = 0;
  let videoProgress = 0;
  let isUploadingAudio = false;
  let isUploadingVideo = false;
  let uploadError = '';
  let audioAnalysisComplete = false;

  $: projectState = $uiStore.projectState;
  $: audioEngineState = $audioEngineStore;
  $: canProceedToEdit = projectState.hasAudio && projectState.hasVideo;

  function triggerAudioUpload() {
    audioFileInput.click();
  }

  function triggerVideoUpload() {
    videoFileInput.click();
  }

  async function handleAudioUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      await processAudioFile(file);
    }
  }

  async function processAudioFile(file: File) {
    // Validate file type
    if (!isValidAudioFile(file)) {
      uploadError = 'Invalid audio file format. Please upload MP3, WAV, or other supported audio files.';
      setTimeout(() => uploadError = '', 5000);
      return;
    }

    uploadError = '';
    isUploadingAudio = true;
    audioProgress = 0;

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        audioProgress += 20;
        if (audioProgress >= 80) {
          clearInterval(progressInterval);
        }
      }, 200);

      // Load audio file into audio service
      await loadAudioFromFile(file);
      
      // Complete progress
      audioProgress = 100;
      
      // Update UI store
      setAudioFile(file);
      
      // Update project store
      setAudioAsset(file);
      updateProjectSettings({
        audioFile: file,
        audioFileName: file.name,
        duration: audioEngineState.totalDuration
      });

      audioAnalysisComplete = true;
      isUploadingAudio = false;
      audioProgress = 0;

    } catch (error) {
      console.error('Error loading audio file:', error);
      uploadError = 'Failed to load audio file. Please try again.';
      isUploadingAudio = false;
      audioProgress = 0;
      setTimeout(() => uploadError = '', 5000);
    }
  }

  function handleVideoUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      Array.from(files).forEach(file => {
        processVideoFile(file);
      });
    }
  }

  async function processVideoFile(file: File) {
    // Validate file type
    if (!isValidVideoFile(file)) {
      uploadError = 'Invalid video file format. Please upload MP4, WebM, or other supported video files.';
      setTimeout(() => uploadError = '', 5000);
      return;
    }

    uploadError = '';
    isUploadingVideo = true;
    videoProgress = 0;

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        videoProgress += 15;
        if (videoProgress >= 90) {
          clearInterval(progressInterval);
        }
      }, 150);

      // Generate video thumbnail and get duration
      const { thumbnail, duration } = await generateVideoThumbnail(file);
      
      videoProgress = 100;

      // Update UI store
      addVideoFile(file);

      // Add to project store with metadata
      const videoClip = addVideoClip(file);
      
      // Update clip with thumbnail and duration
      import('$lib/stores/projectStore').then(({ updateVideoClip }) => {
        updateVideoClip(videoClip.id, {
          thumbnail,
          duration,
          clipEnd: duration
        });
      });

      isUploadingVideo = false;
      videoProgress = 0;

    } catch (error) {
      console.error('Error processing video file:', error);
      uploadError = 'Failed to process video file. Please try again.';
      isUploadingVideo = false;
      videoProgress = 0;
      setTimeout(() => uploadError = '', 5000);
    }
  }

  async function generateVideoThumbnail(file: File): Promise<{ thumbnail: string; duration: number }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 180;
        
        // Seek to 1 second or 10% of duration for thumbnail
        const thumbnailTime = Math.min(1, video.duration * 0.1);
        video.currentTime = thumbnailTime;
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          resolve({ thumbnail, duration: video.duration });
        } else {
          reject(new Error('Failed to create canvas context'));
        }
        
        // Clean up
        URL.revokeObjectURL(video.src);
      };

      video.onerror = () => {
        reject(new Error('Failed to load video'));
        URL.revokeObjectURL(video.src);
      };

      video.src = URL.createObjectURL(file);
      video.load();
    });
  }

  function handleDrop(event: DragEvent, type: 'audio' | 'video') {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      if (type === 'audio' && files[0]) {
        processAudioFile(files[0]);
      } else if (type === 'video') {
        Array.from(files).forEach(file => {
          processVideoFile(file);
        });
      }
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function proceedToEditMode() {
    if (canProceedToEdit) {
      setAppMode('edit');
    }
  }
</script>

<div class="setup-view">
  <div class="setup-header">
    <h1>Project Setup</h1>
    <p>Upload your master audio track and video clips to get started</p>
  </div>

  {#if uploadError}
    <div class="error-message">
      <CircleAlert size={20} />
      <span>{uploadError}</span>
    </div>
  {/if}

  <div class="upload-section">
    <div class="upload-area-container">
      <!-- Audio Upload Area -->
      <div
        class="upload-area audio-upload"
        class:has-file={projectState.hasAudio}
        class:complete={audioAnalysisComplete}
        on:drop={(e) => handleDrop(e, 'audio')}
        on:dragover={handleDragOver}
        role="button"
        tabindex="0"
        on:click={triggerAudioUpload}
        on:keydown={(e) => e.key === 'Enter' && triggerAudioUpload()}
      >
        <div class="upload-content">
          {#if audioAnalysisComplete}
            <CircleCheck size={48} class="upload-icon success" />
          {:else}
            <Music size={48} class="upload-icon" />
          {/if}
          <h3>Upload Master Audio</h3>
          <p>Drop your audio file here or click to browse</p>
          <span class="file-types">Supports MP3, WAV, FLAC, OGG</span>
          {#if projectState.audioFile}
            <div class="file-info">
              <span class="file-name">{projectState.audioFile.name}</span>
              {#if audioEngineState.totalDuration > 0}
                <span class="file-duration">Duration: {Math.floor(audioEngineState.totalDuration / 60)}:{(audioEngineState.totalDuration % 60).toFixed(0).padStart(2, '0')}</span>
              {/if}
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
          <span class="file-types">Supports MP4, WebM, MOV</span>
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
              {#if audioAnalysisComplete}
                <CircleCheck size={16} class="success-icon" />
              {/if}
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

    <!-- Proceed to Edit Button -->
    {#if canProceedToEdit}
      <div class="proceed-section">
        <button 
          class="proceed-button"
          class:ready={audioAnalysisComplete}
          on:click={proceedToEditMode}
        >
          <span>Start Editing</span>
          <CircleCheck size={20} />
        </button>
        <p class="proceed-note">
          All required media has been uploaded. Ready to start editing!
        </p>
      </div>
    {:else}
      <div class="requirements-section">
        <h4>Requirements to Continue:</h4>
        <ul class="requirements-list">
          <li class:complete={projectState.hasAudio}>
            {#if projectState.hasAudio}
              <CircleCheck size={16} />
            {:else}
              <div class="requirement-dot"></div>
            {/if}
            Upload master audio track
          </li>
          <li class:complete={projectState.hasVideo}>
            {#if projectState.hasVideo}
              <CircleCheck size={16} />
            {:else}
              <div class="requirement-dot"></div>
            {/if}
            Upload at least one video clip
          </li>
        </ul>
      </div>
    {/if}
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

  .error-message {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    background: var(--color-error);
    color: var(--bg-primary);
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-lg);
    font-weight: 500;
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

  .upload-area.complete {
    border-color: var(--color-success);
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

  :global(.upload-icon.success) {
    color: var(--color-success);
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
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .file-name, .file-count, .file-duration {
    color: var(--neon-accent-1);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .file-duration {
    color: var(--text-secondary);
    font-size: 0.8rem;
  }

  .asset-preview {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
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

  :global(.success-icon) {
    color: var(--color-success);
    margin-left: auto;
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

  .proceed-section {
    text-align: center;
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    border: 1px solid var(--neon-accent-1);
  }

  .proceed-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    justify-content: center;
    background: var(--neon-accent-1);
    color: var(--bg-primary);
    border: none;
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-sm);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    margin: 0 auto var(--spacing-md);
  }

  .proceed-button:hover {
    background: var(--color-success);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
  }

  .proceed-note {
    color: var(--text-secondary);
    margin: 0;
  }

  .requirements-section {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
  }

  .requirements-section h4 {
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
  }

  .requirements-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .requirements-list li {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) 0;
    color: var(--text-secondary);
  }

  .requirements-list li.complete {
    color: var(--color-success);
  }

  .requirement-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--border-color);
  }

  @media (max-width: 768px) {
    .upload-area-container {
      grid-template-columns: 1fr;
    }
  }
</style> 