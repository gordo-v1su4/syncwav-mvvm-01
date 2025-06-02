<script lang="ts">
  import WaveformDisplay from '$lib/components/WaveformDisplay.svelte';
  let file: File | null = null;
  let url: string = '';
  let uploading = false;
  let uploadError = '';
  let uploadProgress = 0;

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      file = input.files[0];
      url = '';
      uploadError = '';
      uploadProgress = 0;
      uploading = true;
      try {
        const formData = new FormData();
        formData.append('audio', file);

        // Use XMLHttpRequest for progress
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'http://localhost:3002/upload/audio');
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              uploadProgress = Math.round((e.loaded / e.total) * 100);
            }
          };
          xhr.onload = () => {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              url = `http://localhost:3002/files/${data.fileId}`;
              resolve();
            } else {
              uploadError = xhr.responseText || 'Upload failed';
              reject(new Error(uploadError));
            }
            uploading = false;
          };
          xhr.onerror = () => {
            uploadError = 'Network error';
            uploading = false;
            reject(new Error(uploadError));
          };
          xhr.send(formData);
        });
      } catch (e) {
        uploadError = e.message || 'Upload failed';
        uploading = false;
      }
    }
  }
</script>

<svelte:head>
  <title>Artivus Engine</title>
  <meta name="description" content="AI-assisted audio-visual creation suite for synchronized music video editing" />
</svelte:head>


{#if uploading}
  <div class="upload-status">
    Uploading... {uploadProgress}%
    <progress max="100" value={uploadProgress}></progress>
  </div>
{/if}
{#if uploadError}
  <div class="upload-error">{uploadError}</div>
{/if}

{#if url}
  <WaveformDisplay {url} />
{/if}
