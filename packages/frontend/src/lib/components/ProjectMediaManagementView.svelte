<script lang="ts">
  import { uiStore, setAppMode } from '$lib/stores/uiStore';
  import { audioEngineStore } from '$lib/stores/audioEngineStore';
  import { projectStore, addVideoClip, setMasterAudioInfo, updateProjectSettings } from '$lib/stores/projectStore';
  import { isValidAudioFile, isValidVideoFile } from '$lib/utils/audioUtils';

  let audioFileInput: HTMLInputElement;
  let videoFileInput: HTMLInputElement;
  
  let audioUploadProgress = 0;
  let videoUploadProgress = 0;
  let isUploadingAudio = false;
  let isUploadingVideo = false;
  let audioUploadError = '';
  let videoUploadError = '';

 // Backend URL
 const BACKEND_URL = 'http://localhost:3002'; // Hardcoded for development

  $: canProceedToEdit = $projectStore.masterAudioInfo && $projectStore.videoClips.length > 0;

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
    target.value = ''; // Reset file input
  }

  async function processAudioFile(file: File) {
    if (!isValidAudioFile(file)) { // Basic client-side check
      audioUploadError = 'Invalid audio file type. Please select MP3 or WAV.';
      setTimeout(() => audioUploadError = '', 5000);
      return;
    }

    audioUploadError = '';
    isUploadingAudio = true;
    audioUploadProgress = 0;

    const formData = new FormData();
    formData.append('audio', file);

    try {
      // Simulate initial progress
      audioUploadProgress = 10;

      const response = await fetch(`${BACKEND_URL}/upload/audio`, {
        method: 'POST',
        body: formData,
      });

      // Simulate remaining progress
      audioUploadProgress = 80;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to upload audio: ${response.statusText}`);
      }

      const result = await response.json();
      
      setMasterAudioInfo({ // Update projectStore with backend response
        fileId: result.fileId,
        originalName: result.originalName,
        backendPath: `${BACKEND_URL}/files/${result.fileId}`, // Construct full URL for fetching
        // duration will be set later after loading and decoding the audio
      });

      isUploadingAudio = false;
      audioUploadProgress = 100;
      setTimeout(() => audioUploadProgress = 0, 1000); // Reset progress bar after a short delay

    } catch (error: any) {
      console.error('Error uploading audio file:', error);
      audioUploadError = error.message || 'Failed to upload audio file. Please try again.';
      isUploadingAudio = false;
      audioUploadProgress = 0;
      setTimeout(() => audioUploadError = '', 5000);
    }
  }

  async function handleVideoUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      for (const file of Array.from(files)) {
        await processVideoFile(file); // Process one by one
      }
    }
    target.value = ''; // Reset file input
  }

  async function processVideoFile(file: File) {
    if (!isValidVideoFile(file)) { // Basic client-side check
      videoUploadError = 'Invalid video file type. Please select MP4.';
      setTimeout(() => videoUploadError = '', 5000);
      return;
    }

    videoUploadError = '';
    isUploadingVideo = true; // Consider per-file upload state if allowing multiple simultaneous uploads
    videoUploadProgress = 0;

    const formData = new FormData();
    formData.append('video', file);

    try {
      videoUploadProgress = 10;

      const response = await fetch(`${BACKEND_URL}/upload/video`, {
        method: 'POST',
        body: formData,
      });

      videoUploadProgress = 80;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to upload video: ${response.statusText}`);
      }

      const result = await response.json();
      const { thumbnail, duration } = await generateVideoThumbnail(file);

      const clipId = `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      addVideoClip({ // Add to projectStore
        id: clipId, // Use a unique client-side ID for the clip instance
        file: file, // Store the original File object
        name: result.originalName,
        duration: duration,
        thumbnail: thumbnail,
        startTime: 0, // Default start time, will be adjusted on timeline
        endTime: duration, // Default end time
        clipStart: 0,
        clipEnd: duration,
        isSelected: false,
        isPlaying: false,
        backendPath: `${BACKEND_URL}/files/${result.fileId}`, // Store backend path for playback
      });

      isUploadingVideo = false;
      videoUploadProgress = 100;
      setTimeout(() => videoUploadProgress = 0, 1000);

    } catch (error: any) {
      console.error('Error uploading video file:', error);
      videoUploadError = error.message || 'Failed to upload video file. Please try again.';
      isUploadingVideo = false;
      videoUploadProgress = 0;
      setTimeout(() => videoUploadError = '', 5000);
    }
  }

async function generateVideoThumbnail(file: File): Promise<{ thumbnail: string; duration: number }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
     
     // Set a timeout to prevent hanging
     const timeout = setTimeout(() => {
       URL.revokeObjectURL(video.src);
       reject(new Error('Thumbnail generation timeout'));
     }, 10000); // 10 second timeout

      video.onloadedmetadata = () => {
       clearTimeout(timeout);
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 180;
        
        const thumbnailTime = Math.min(1, video.duration * 0.1);
        video.currentTime = thumbnailTime;
      };

      video.onseeked = () => {
       clearTimeout(timeout);
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          resolve({ thumbnail, duration: video.duration });
        } else {
          reject(new Error('Failed to create canvas context for thumbnail'));
        }
        URL.revokeObjectURL(video.src);
      };

      video.onerror = (e) => {
       clearTimeout(timeout);
        console.error("Error loading video for thumbnail:", e);
        reject(new Error('Failed to load video for thumbnail generation'));
        URL.revokeObjectURL(video.src);
      };
      
      video.src = URL.createObjectURL(file);
    });
  }

  function handleDrop(event: DragEvent, type: 'audio' | 'video') {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      if (type === 'audio') {
        processAudioFile(files[0]);
      } else if (type === 'video') {
        for (const file of Array.from(files)) {
          processVideoFile(file);
        }
      }
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault(); // Necessary to allow dropping
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
    }
  }

  function proceedToEditMode() {
    if (canProceedToEdit) {
      console.log("Proceeding to edit mode. Master audio info:", $projectStore.masterAudioInfo);
      console.log("Video clips:", $projectStore.videoClips);
      setAppMode('edit');
    } else {
      if (!$projectStore.masterAudioInfo) {
        audioUploadError = "Please upload a master audio track.";
        setTimeout(() => audioUploadError = '', 3000);
      }
      if ($projectStore.videoClips.length === 0) {
        videoUploadError = "Please upload at least one video clip.";
        setTimeout(() => videoUploadError = '', 3000);
      }
    }
  }
</script>

<div class="setup-view">
  <div class="setup-header">
    <h1>Project Media Management</h1>
    <p>Upload your master audio track and video clips</p>
  </div>

  <!-- Combined Error Area -->
  {#if audioUploadError || videoUploadError}
    <div class="error-messages-container">
      {#if audioUploadError}
        <div class="error-message audio-error">
          <!-- CircleAlert SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{audioUploadError}</span>
        </div>
      {/if}
      {#if videoUploadError}
        <div class="error-message video-error">
          <!-- CircleAlert SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{videoUploadError}</span>
        </div>
      {/if}
    </div>
  {/if}

  <div class="upload-sections-container">
    <!-- Audio Upload Section -->
    <div class="upload-section audio-section">
      <div
        class="upload-area audio-upload"
        class:has-file={$projectStore.masterAudioInfo}
        class:uploading={isUploadingAudio}
        on:drop={(e) => handleDrop(e, 'audio')}
        on:dragover={handleDragOver}
        role="button"
        tabindex="0"
       aria-label="Upload audio file - drag and drop or click to browse"
       aria-describedby="audio-upload-help"
        on:click={triggerAudioUpload}
        on:keydown={(e) => e.key === 'Enter' && triggerAudioUpload()}
      >
        <input type="file" bind:this={audioFileInput} on:change={handleAudioUpload} accept="audio/mpeg, audio/wav, audio/mp3" hidden />
       <div id="audio-upload-help" class="sr-only">
         Supports MP3 and WAV audio formats. Maximum file size 100MB.
       </div>
        <div class="upload-content">
          {#if $projectStore.masterAudioInfo}
            <!-- CircleCheck SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon success">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m8 12 3 3 6-6"></path>
            </svg>
            <h3>Master Audio Track</h3>
            <p class="file-name">{$projectStore.masterAudioInfo.originalName || 'Audio file ready'}</p>
            <button class="replace-btn" on:click|stopPropagation={triggerAudioUpload}>Replace</button>
          {:else if isUploadingAudio}
            <!-- Upload SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon active">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h3>Uploading Audio...</h3>
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: {audioUploadProgress}%"></div>
            </div>
            <p>{audioUploadProgress}%</p>
          {:else}
            <!-- Music SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
            <h3>Upload Master Audio</h3>
            <p>Drop your audio file here or click to browse</p>
            <span class="file-types">Supports MP3, WAV</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Video Upload Section -->
    <div class="upload-section video-section">
      <div
        class="upload-area video-upload"
        class:has-files={$projectStore.videoClips.length > 0}
        class:uploading={isUploadingVideo}
        on:drop={(e) => handleDrop(e, 'video')}
        on:dragover={handleDragOver}
        role="button"
        tabindex="0"
        on:click={triggerVideoUpload}
        on:keydown={(e) => e.key === 'Enter' && triggerVideoUpload()}
      >
        <input type="file" bind:this={videoFileInput} on:change={handleVideoUpload} accept="video/mp4" multiple hidden />
        <div class="upload-content">
          {#if $projectStore.videoClips.length > 0 && !isUploadingVideo}
            <!-- CircleCheck SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon success">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m8 12 3 3 6-6"></path>
            </svg>
            <h3>{ $projectStore.videoClips.length } Video Clip{$projectStore.videoClips.length > 1 ? 's' : ''}</h3>
            <p>Add more clips or proceed to editing</p>
            <button class="add-more-btn" on:click|stopPropagation={triggerVideoUpload}>Add More</button>
          {:else if isUploadingVideo}
            <!-- Upload SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon active">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h3>Uploading Video...</h3>
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: {videoUploadProgress}%"></div>
            </div>
            <p>{videoUploadProgress}%</p>
          {:else}
            <!-- Video SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            <h3>Upload Video Clips</h3>
            <p>Drop MP4 files here or click to browse</p>
            <span class="file-types">Supports MP4</span>
          {/if}
        </div>
      </div>
      
      <!-- Display for uploaded video clips (optional preview) -->
      {#if $projectStore.videoClips.length > 0}
      <div class="video-clips-preview">
        <h4>Uploaded Video Clips</h4>
        <div class="clips-gallery">
          {#each $projectStore.videoClips as clip (clip.id)}
            <div class="clip-preview">
              {#if clip.thumbnail}
                <div class="thumbnail-container">
                  <img src={clip.thumbnail} alt="{clip.name} thumbnail" class="video-thumbnail" />
                </div>
              {:else}
                <div class="thumbnail-placeholder">
                  <!-- Video SVG -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                </div>
              {/if}
              <div class="clip-info">
                <span class="clip-name">{clip.name}</span>
                <span class="clip-duration">{clip.duration ? Math.floor(clip.duration / 60) + ':' + (Math.floor(clip.duration) % 60).toString().padStart(2, '0') : '...'}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
      {/if}
    </div>
  </div>

  <div class="setup-actions">
    <button class="proceed-button" on:click={proceedToEditMode} disabled={!canProceedToEdit || isUploadingAudio || isUploadingVideo}>
      Proceed to Editing
    </button>
  </div>

</div>

<style>
/* General View Styles */
.setup-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl) var(--spacing-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  height: 100%;
  overflow-y: auto;
}

.setup-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.setup-header h1 {
  font-size: 2rem;
  color: var(--neon-accent-1);
  margin-bottom: var(--spacing-sm);
}

.setup-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* Error Messages */
.error-messages-container {
  width: 100%;
  max-width: 800px;
  margin-bottom: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.error-message {
  background-color: rgba(255, 85, 85, 0.1); 
  border: 1px solid var(--color-error);
  color: var(--color-error);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.95rem;
}

.error-message span {
  flex-grow: 1;
}

/* Upload Sections Layout */
.upload-sections-container {
  display: flex;
  gap: var(--spacing-xl);
  width: 100%;
  max-width: 1200px;
  justify-content: space-around;
  margin-bottom: var(--spacing-xl);
}

.upload-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 350px;
  gap: var(--spacing-lg);
}

/* Upload Area Styling */
.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  background-color: var(--bg-secondary);
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.upload-area:hover,
.upload-area:focus-within {
  border-color: var(--neon-accent-1);
  background-color: var(--bg-elevated);
}

.upload-area.has-file,
.upload-area.has-files {
  border-color: var(--neon-accent-1);
  border-style: solid;
  background-color: var(--bg-elevated);
}

.upload-area.uploading {
  border-color: var(--neon-accent-3);
  border-style: solid;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.upload-content h3 {
  font-size: 1.4rem;
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.upload-content p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.file-name {
  font-weight: 500;
  color: var(--text-primary) !important;
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: var(--spacing-md);
}

.upload-icon {
  color: var(--neon-accent-1);
  margin-bottom: var(--spacing-md);
  transition: transform var(--transition-fast);
}

.upload-area:hover .upload-icon {
  transform: scale(1.1);
}

.upload-icon.success {
  color: var(--neon-accent-1);
}

.upload-icon.active {
  color: var(--neon-accent-3);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.file-types {
  font-size: 0.85rem;
  color: var(--text-dimmed);
}

/* Progress Bar */
.progress-bar-container {
  width: 80%;
  height: 12px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  margin: var(--spacing-md) auto;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--neon-accent-1);
  width: 0%;
  transition: width var(--transition-fast);
  border-radius: var(--radius-sm);
}

/* Replace/Add More buttons */
.replace-btn, .add-more-btn {
  background-color: transparent;
  color: var(--neon-accent-3);
  border: 1px solid var(--neon-accent-3);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: all var(--transition-fast);
  margin-top: var(--spacing-sm);
}

.replace-btn:hover, .add-more-btn:hover {
  background-color: var(--neon-accent-3);
  color: var(--bg-primary);
}

/* Video Clips Preview */
.video-clips-preview {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  max-height: 300px;
  overflow-y: auto;
}

.video-clips-preview h4 {
  margin-top: 0;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  font-size: 1.1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--spacing-sm);
}

.clips-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-md);
}

.clip-preview {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--bg-tertiary);
  transition: transform var(--transition-fast);
}

.clip-preview:hover {
  transform: translateY(-2px);
}

.thumbnail-container {
  width: 100%;
  height: 100px;
  overflow: hidden;
  position: relative;
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
}

.clip-info {
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
}

.clip-name {
  font-size: 0.85rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clip-duration {
  font-size: 0.75rem;
  color: var(--text-dimmed);
  font-family: monospace;
}

/* Setup Actions */
.setup-actions {
  margin-top: var(--spacing-lg);
  text-align: center;
}

.proceed-button {
  background-color: var(--neon-accent-1);
  color: var(--bg-primary);
  border: none;
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.1);
}

.proceed-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

.proceed-button:disabled {
  background-color: var(--bg-tertiary);
  color: var(--text-dimmed);
  cursor: not-allowed;
  box-shadow: none;
}

/* Responsive */
@media (max-width: 900px) {
  .upload-sections-container {
    flex-direction: column;
    align-items: center;
  }
  
  .upload-section {
    width: 100%;
    max-width: 600px;
  }
}
</style>