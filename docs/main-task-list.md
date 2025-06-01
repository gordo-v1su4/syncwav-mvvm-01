Okay, this is a highly detailed breakdown of the Artivus Engine MVP into a checklist of tasks, derived from the PRD, Project Brief, and UI/UX Specification. This checklist is designed to be granular enough for an AI Coding Agent to process.

**Checklist Conventions:**

*   Tasks are grouped under their respective Epics and User Stories from the PRD.
*   Each `- [ ]` represents a granular task, aimed to be roughly equivalent to a "one-story-point" effort.
*   UI/UX details (dark mode, "rust-peaks" aesthetic, neon accents, specific panel layouts) are integrated into relevant component creation and styling tasks.
*   Technical assumptions from the PRD (Svelte, Vite, Rust/WASM, WebGL2, WebCodecs, etc.) are incorporated into the tasks.
*   Non-Functional Requirements (NFRs) are listed separately at the end but should be considered throughout development. Key NFRs are also hinted at within specific story tasks (e.g., performance for real-time modules).

---

# Artivus Engine MVP - Detailed Task Checklist

## General Project Setup & Cross-Cutting Concerns

### Project Initialization & Core Structure (Ref: Story 1.1)
*   `- [X] Initialize a new Svelte project using Vite.`
*   `- [X] Configure Vite for Svelte development (including HMR, TypeScript support if planned).`
*   `- [X] Set up a monorepo structure (e.g., using pnpm workspaces, Turborepo, or Nx) to house:
    *   `- [X] Frontend Svelte application (`packages/frontend`).`
    *   `- [ ] Rust/WASM modules (`packages/rust-modules` or similar).`
    *   `- [X] Minimal backend service (`packages/backend`).`
*   `- [X] Define and configure ESLint and Prettier for consistent code style across the monorepo.`
*   `- [ ] Implement basic unit testing setup (e.g., Vitest) for Svelte components.`
*   `- [ ] Implement basic unit testing setup for Rust modules.`
*   `- [ ] Set up `wasm-pack` or similar tool for building Rust to WASM and integrating with the frontend.`

### Backend Service - Initial Setup (Minimal for MVP - Ref: Story 1.2, 1.4)
*   `- [X] Choose backend stack: Node.js/Express (Alternative: Rust with Actix/Axum, requires confirmation by Architect). For this checklist, Node.js/Express is assumed for initial tasks.`
*   `- [X] Create a basic Node.js/Express application structure within `packages/backend`.`
*   `- [X] Configure basic middleware (e.g., `cors`, `body-parser` for JSON and multipart/form-data).`
*   `- [X] Implement a health check endpoint (e.g., `/health`) for the backend service.`
*   `- [X] Define a strategy for temporary storage of uploaded media files on the backend (e.g., a `/uploads` directory, ensuring it's not directly publicly accessible).`
*   `- [X] Implement basic error handling middleware for the backend.`

## Epic 1: Project Foundation & Core Media Handling

### Story 1.1: As a Creator, I want to set up a new project in Artivus Engine so that I can start working on my audio-visual piece.
*   `Core Application Shell & Layout:`
    *   `- [X] Create the main `App.svelte` root component in the frontend package.`
    *   `- [X] Implement a global layout structure within `App.svelte` to host the mode switcher and main content area.`
    *   `- [X] Create a `ModeSwitcher.svelte` component for primary "Mode" Tabs ([SETUP], [EDIT], [EXPORT]).`
    *   `- [X] Style `ModeSwitcher.svelte` according to UI/UX specs: dark mode, "rust-peaks" inspiration, neon accents for active tab.`
    *   `- [X] Implement logic in `ModeSwitcher.svelte` and `App.svelte` for tab switching to conditionally render different view components.`
    *   `- [X] Create placeholder Svelte components for each main view:
        *   `- [X] `AppEntryHubView.svelte` (Initial view for project creation/selection).`
        *   `- [X] `ProjectMediaManagementView.svelte` (for [SETUP] Mode).`
        *   `- [X] `MainEditingInterfaceView.svelte` (for [EDIT] Mode).`
        *   `- [X] `ExportView.svelte` (for [EXPORT] Mode).`
        *   `- [X] `ApplicationSettingsView.svelte` (Minimal for MVP).`
    *   `- [ ] Design and implement a `GlobalHeader.svelte` component (or persistent menu) for navigation to "App Entry / Project Hub" and "Application Settings".`
    *   `- [ ] Apply global CSS for the dark mode theme (body background, default text colors, scrollbar styling if custom).`
    *   `- [ ] Implement CSS utility classes for "rust-peaks" aesthetic elements and neon accent colors.`
    *   `- [ ] Ensure the main application layout is responsive for common desktop screen resolutions.`
    *   `- [ ] Implement logic to display a "best viewed on desktop" message when accessed on tablet/mobile screen sizes.`
*   `Project Initialization Logic:`
    *   `- [X] Create a Svelte store (`projectStore.js` or similar) for managing global project state (e.g., `currentProject`, `masterAudioInfo`, `videoAssets`, `currentMode`).`
    *   `- [ ] Implement a "Create New Project" button/action in `AppEntryHubView.svelte`.`
    *   `- [ ] Clicking "Create New Project" should initialize/reset relevant parts of `projectStore` and navigate the user to the "SETUP" Mode (`ProjectMediaManagementView.svelte`).`
*   `Initial Accessibility:`
    *   `- [ ] Ensure `ModeSwitcher.svelte` tabs are keyboard navigable (e.g., using arrow keys, Enter/Space to select).`
    *   `- [ ] Verify initial dark mode theme and accent colors meet WCAG AA contrast ratios for text and UI controls.`

### Story 1.2: As a Creator, I want to upload a primary audio track (e.g., MP3, WAV) into my project so that I can use it as the basis for my synchronization.
*   `Backend Endpoint for Audio Upload:`
    *   `- [X] (Backend) Implement a POST endpoint (e.g., `/upload/audio`) to receive audio file uploads.`
    *   `- [X] (Backend) Use `multer` or similar middleware to handle `multipart/form-data` for file uploads.`
    *   `- [X] (Backend) Validate uploaded file type (server-side check for MP3, WAV MIME types).`
    *   `- [X] (Backend) Implement file size limits for uploads (configurable).`
    *   `- [X] (Backend) Save the uploaded audio file to the temporary storage location with a unique filename.`
    *   `- [X] (Backend) Return a JSON response with success status and an identifier/path for the uploaded file (e.g., `{ success: true, fileId: 'unique_id.mp3', originalName: 'track.mp3' }`).`
*   `Frontend UI for Audio Upload ([SETUP] Mode):`
    *   `- [ ] In `ProjectMediaManagementView.svelte` ([SETUP] Mode), implement a "Media Upload Area".`
    *   `- [ ] Add a styled file input element (`<input type="file" accept="audio/mp3, audio/wav">`) or a button that triggers a hidden file input for master audio selection.`
    *   `- [ ] Implement a UI element (e.g., progress bar, percentage text) to display audio upload progress.`
*   `Frontend Logic for Audio Upload & Handling:`
    *   `- [ ] On file selection, perform client-side validation for file type (MP3, WAV) and size (optional, as backend validates too).`
    *   `- [ ] Implement a service/function to send the selected audio file to the backend `/upload/audio` endpoint using `fetch` API with `FormData`.`
    *   `- [ ] Attach event listeners to `XMLHttpRequest.upload` (if using XHR) or monitor `fetch` stream for upload progress and update the UI.`
    *   `- [ ] On successful upload (backend returns success):
        *   `- [ ] Store master audio information (e.g., `fileId`, `originalName`, backend path) in `projectStore.masterAudioInfo`.`
        *   `- [ ] Fetch the uploaded audio file from the backend (or use its temporary local `Blob` if not immediately sending to backend for storage, then send) and decode it into an `AudioBuffer` using Web Audio API (`AudioContext.decodeAudioData`).`
        *   `- [ ] Store the `AudioBuffer` in `projectStore.masterAudioBuffer`.`
        *   `- [ ] Automatically transition the application to "EDIT" Mode (`MainEditingInterfaceView.svelte`) as per UI/UX flow.`
    *   `- [ ] On upload error (network error or backend returns failure): Display a user-friendly error message.`
*   `Security:`
    *   `- [ ] (Backend) Ensure the temporary upload directory is not directly browsable/accessible via web server configuration.`
    *   `- [ ] (Backend) Sanitize filenames to prevent path traversal issues if original names are used in file paths.`

### Story 1.3: As a Creator, I want to see an interactive waveform display of my uploaded audio track so that I can visually understand its structure and navigate it.
*   `Waveform Data Generation:`
    *   `- [ ] Implement a JavaScript function to process an `AudioBuffer` and generate peak data suitable for waveform rendering (e.g., an array of min/max pairs per segment). Consider performance for long tracks.`
    *   `- [ ] (Alternative Research) Evaluate using a lightweight WASM module (e.g., from Essentia.js or custom Rust) for faster peak data generation if JS performance is insufficient. For MVP, JS first.`
*   `Waveform UI Component (`WaveformDisplay.svelte`):`
    *   `- [ ] Create `WaveformDisplay.svelte` component for the "Top Prominent Waveform Display Row" in `MainEditingInterfaceView.svelte`.`
    *   `- [ ] Use HTML Canvas API within `WaveformDisplay.svelte` to render the waveform based on the generated peak data.`
    *   `- [ ] Style the waveform display: dark background, contrasting waveform color (e.g., a neon accent), clear visual representation of amplitude.`
    *   `- [ ] Implement a visual playback cursor/playhead (a vertical line) that overlays the waveform.`
*   `Playback Controls & State Management:`
    *   `- [ ] Create `PlaybackControls.svelte` component (integrated near waveform or timeline).`
    *   `- [ ] Implement UI buttons for Play, Pause, Stop in `PlaybackControls.svelte`.`
    *   `- [ ] Style controls according to UI/UX theme, with clear state indication (e.g., Play icon changes to Pause).`
    *   `- [ ] Create a `playbackStore.js` Svelte store to manage `isPlaying`, `currentTime`, `duration`.`
    *   `- [ ] Initialize Web Audio API `AudioContext` and `AudioBufferSourceNode`.`
    *   `- [ ] Connect Play/Pause buttons to start/stop/resume the `AudioBufferSourceNode` and update `playbackStore`.`
    *   `- [ ] Update `playbackStore.currentTime` using a `requestAnimationFrame` loop while playing.`
    *   `- [ ] Update the visual playhead position on `WaveformDisplay.svelte` based on `playbackStore.currentTime`.`
*   `Seek Functionality:`
    *   `- [ ] In `WaveformDisplay.svelte`, implement click-to-seek: on click, calculate the time corresponding to the click position, update `playbackStore.currentTime`, and restart playback from that new time if playing, or just move playhead if paused.`
*   `Zoom Functionality:`
    *   `- [ ] Add UI controls (e.g., `+`/`-` buttons, or a slider) in `PlaybackControls.svelte` or near `WaveformDisplay.svelte` for horizontal zoom.`
    *   `- [ ] Store current zoom level in `playbackStore` or `waveformViewStore`.`
    *   `- [ ] `WaveformDisplay.svelte` should re-render the waveform based on the current zoom level, showing more or less detail from the peak data.`
    *   `- [ ] Implement horizontal scrolling capability for the waveform when zoomed in (e.g., custom scrollbar or drag-to-scroll).`

### Story 1.4: As a Creator, I want to upload at least one video clip (e.g., MP4) into my project so that I can synchronize it with my audio.
*   `Backend Endpoint for Video Upload:`
    *   `- [X] (Backend) Implement a POST endpoint (e.g., `/upload/video`) to receive video file uploads.`
    *   `- [X] (Backend) Use `multer` or similar for `multipart/form-data` handling.`
    *   `- [X] (Backend) Validate uploaded file type (MP4 MIME type) and size.`
    *   `- [X] (Backend) Save uploaded video to temporary storage with a unique filename.`
    *   `- [X] (Backend) Return JSON response with success status and file identifier/path (e.g., `{ success: true, fileId: 'unique_video.mp4', originalName: 'clip.mp4' }`).`
*   `Frontend UI for Video Upload ([SETUP] Mode):`
    *   `- [ ] In `ProjectMediaManagementView.svelte`, add UI for uploading video clips (can be part of the same "Media Upload Area" or a distinct section, allowing multiple file selection).`
    *   `- [ ] Add a styled file input element (`<input type="file" accept="video/mp4" multiple>`) or button.`
    *   `- [ ] Implement UI to display upload progress for each video file if multiple are selected.`
*   `Frontend Logic for Video Upload & Handling:`
    *   `- [ ] On file(s) selection, validate file type (MP4) and size client-side.`
    *   `- [ ] Implement logic to send selected video file(s) to the backend `/upload/video` endpoint (iterate and upload one by one or in parallel with progress updates).`
    *   `- [ ] On successful upload of each video:
        *   `- [ ] Create a video asset object (e.g., `{ id: 'unique_id', name: 'clip.mp4', backendPath: 'path/to/video.mp4', thumbnailUrl: null, duration: null }`).`
        *   `- [ ] Add this object to an array in `projectStore.videoAssets`.`
    *   `- [ ] On upload error: Display an error message.`
*   `Project Asset Library UI (`AssetLibrary.svelte` - [EDIT] Mode):`
    *   `- [ ] Create `AssetLibrary.svelte` component for the "Left Side Panel (Collapsible)" in `MainEditingInterfaceView.svelte`.`
    *   `- [ ] Style `AssetLibrary.svelte` for dark mode, professional feel.`
    *   `- [ ] `AssetLibrary.svelte` should display a list of video assets from `projectStore.videoAssets`. Each item should show video name.`
*   `Video Thumbnail Generation & Display:`
    *   `- [ ] For each uploaded video asset in `projectStore.videoAssets`:
        *   `- [ ] Implement a client-side function `generateVideoThumbnail(videoFileOrUrl)`:
            *   `- [ ] Create a hidden HTML `<video>` element.`
            *   `- [ ] Set its `src` to a `URL.createObjectURL(videoFile)` (if file is still client-side) or the backend path/URL of the video.`
            *   `- [ ] On `loadeddata` and `seeked` events: seek to a specific time (e.g., 1 second or 10% of duration).`
            *   `- [ ] Draw the video frame onto a hidden HTML `<canvas>` element.`
            *   `- [ ] Convert canvas content to a data URL (`canvas.toDataURL('image/jpeg')`).`
            *   `- [ ] Store this `thumbnailUrl` in the corresponding video asset object in `projectStore.videoAssets`.`
            *   `- [ ] Get video duration from the `<video>` element and store it.
        *   `- [ ] Update `AssetLibrary.svelte` to display the generated thumbnail next to each video name.`
        *   `- [ ] Handle potential errors during thumbnail generation gracefully.`

### Story 1.5: As a Creator, I want to play my uploaded video clip in synchronization with the master audio track, controlled by the main audio playback controls.
*   `Video Preview Area UI (`VideoPreview.svelte` - [EDIT] Mode):`
    *   `- [ ] Create `VideoPreview.svelte` component for the "Top-Center Video Preview Area" in `MainEditingInterfaceView.svelte`.`
    *   `- [ ] Inside `VideoPreview.svelte`, add an HTML `<canvas>` element for WebGL2 rendering.`
*   `WebGL2 Rendering Setup for Video:`
    *   `- [ ] In `VideoPreview.svelte`, initialize a WebGL2 context from the canvas.`
    *   `- [ ] Write basic GLSL vertex shader to pass through texture coordinates and position.`
    *   `- [ ] Write basic GLSL fragment shader to sample a 2D texture (`sampler2D`).`
    *   `- [ ] Compile shaders and link into a WebGL program.`
    *   `- [ ] Create WebGL buffers for a simple quad (vertices, texture coordinates) that covers the canvas.`
    *   `- [ ] Create a WebGL texture object that will receive video frames.`
*   `Video Loading and Frame Source (using HTML `<video>` element as texture source for MVP):`
    *   `- [ ] Create a hidden HTML `<video id="videoTextureSource">` element managed by `VideoPreview.svelte` or a relevant store/service.`
    *   `- [ ] Mute this `<video>` element (`videoTextureSource.muted = true`).`
    *   `- [ ] When a video is selected for playback (e.g., first video in `projectStore.videoAssets` initially, or a user-selected one):
        *   `- [ ] Set `videoTextureSource.src` to the backend path or `URL.createObjectURL` of the selected video.`
*   `Synchronization Logic:`
    *   `- [ ] Subscribe to `playbackStore.isPlaying` and `playbackStore.currentTime`.`
    *   `- [ ] When audio play starts (`playbackStore.isPlaying` becomes true):
        *   `- [ ] Call `videoTextureSource.play()`.`
        *   `- [ ] Ensure `videoTextureSource.currentTime` is synchronized with `playbackStore.currentTime`.`
    *   `- [ ] When audio pauses: Call `videoTextureSource.pause()`.`
    *   `- [ ] When audio seeks (user interacts with `WaveformDisplay.svelte` or seek controls):
        *   `- [ ] Set `videoTextureSource.currentTime = playbackStore.currentTime`.`
*   `Real-time Video Frame Rendering to WebGL Canvas:`
    *   `- [ ] In `VideoPreview.svelte`'s rendering loop (driven by `requestAnimationFrame`):
        *   `- [ ] If `videoTextureSource` has new frame data available (check `video.readyState` and `video.HAVE_ENOUGH_DATA`, or use `video.requestVideoFrameCallback()` if targeting supporting browsers and it simplifies):`
            *   `- [ ] Update the WebGL texture (`gl.texImage2D` or `gl.texSubImage2D`) with the current frame from `videoTextureSource`.`
        *   `- [ ] Clear the WebGL canvas.`
        *   `- [ ] Use the video texture shader program.`
        *   `- [ ] Bind the video texture.`
        *   `- [ ] Draw the quad.`
*   `Initial Video Selection Logic:`
    *   `- [ ] Implement a basic mechanism in `AssetLibrary.svelte` to "select" a video for preview (e.g., clicking an item sets `projectStore.activeVideoAssetId`).`
    *   `- [ ] `VideoPreview.svelte` should react to changes in `projectStore.activeVideoAssetId` to load the correct video into `videoTextureSource`.`

## Epic 2: Foundational Audio Analysis & Marker System

### Story 2.1: As a Creator, I want the system to automatically detect and display beat markers on my master audio track's waveform so that I have a rhythmic guide for editing.
*   `Beat Detection WASM Module (Rust/Essentia.js):`
    *   `- [X] (Rust/WASM package) Research and select a suitable beat detection algorithm (e.g., from Essentia.js, or implement/port one in Rust).`
    *   `- [X] (Rust/WASM package) Create a Rust function `detect_beats(audio_data: Vec<f32>, sample_rate: f32) -> Vec<f64>` that returns beat timestamps.`
    *   `- [ ] (Rust/WASM package) Compile this function to a WASM module, exposing `detect_beats`.`
    *   `- [ ] (Frontend) Load and instantiate this WASM module in the Svelte app.`
*   `Frontend UI for Beat Detection:`
    *   `- [ ] Create `AudioAnalysisControls.svelte` for the "Right Side Panel (Collapsible)" in `MainEditingInterfaceView.svelte`. This panel should be tabbed or sectioned.`
    *   `- [ ] Add a "Detect Master Beats" button within an "Audio Analysis" section of `AudioAnalysisControls.svelte`.`
    *   `- [ ] Add a loading indicator/message UI element to show when beat detection is in progress.`
*   `Frontend Logic for Beat Detection:`
    *   `- [ ] When "Detect Master Beats" is clicked:
        *   `- [ ] Show loading indicator.`
        *   `- [ ] Get the master `AudioBuffer` from `projectStore.masterAudioBuffer` and its sample rate.`
        *   `- [ ] Extract raw PCM data (e.g., Float32Array from the first channel).`
        *   `- [ ] Call the WASM `detect_beats` function with the PCM data and sample rate.`
        *   `- [ ] On completion, store the returned beat timestamps in `projectStore.masterBeatMarkers` (an array of numbers).`
        *   `- [ ] Hide loading indicator and display a success/error message.`
*   `Waveform Display Enhancement for Markers:`
    *   `- [ ] Modify `WaveformDisplay.svelte` to accept and render an array of marker timestamps.`
    *   `- [ ] Iterate through `projectStore.masterBeatMarkers` and draw a visual representation for each beat (e.g., a thin vertical line of a specific neon color) at the correct time position on the waveform.`
    *   `- [ ] Ensure beat markers scale and reposition correctly with waveform zoom and pan.`

### Story 2.2: As a Creator, I want to isolate at least two key stems (e.g., vocals, drums) from my master audio track so I can analyze their specific rhythmic or dynamic content.
*   `Stem Isolation WASM Module (Rust/Suitable Library):`
    *   `- [X] (Rust/WASM package) Critical Research Task: Find a lightweight, client-side capable stem separation model/library for vocals and drums that can be compiled to WASM (e.g., explore options within Essentia.js, or look for WASM ports of models like a very light Spleeter variant if possible). This is a complex feature; for MVP, a simplified or lower-quality approach might be needed if full separation is too heavy.`
    *   `- [X] (Rust/WASM package) If a suitable library/model is found:
        *   `- [X] Implement Rust bindings and a function `separate_stems(audio_data: Vec<f32>, sample_rate: f32) -> (Vec<f32>, Vec<f32>)` returning (vocals_data, drums_data).`
        *   `- [ ] Compile this to the WASM module.`
    *   `- [ ] (Frontend) Integrate this new WASM function.`
*   `Frontend UI for Stem Isolation:`
    *   `- [ ] In `AudioAnalysisControls.svelte` (Right Side Panel), add a "Isolate Vocals & Drums" button.`
    *   `- [ ] Add a loading indicator for stem separation (this process might be lengthy).`
*   `Frontend Logic for Stem Isolation:`
    *   `- [ ] When "Isolate Vocals & Drums" is clicked:
        *   `- [ ] Show loading indicator.`
        *   `- [ ] Get master audio data and sample rate.`
        *   `- [ ] Call the WASM `separate_stems` function.`
        *   `- [ ] On completion, convert the returned `Vec<f32>` data for vocals and drums into `AudioBuffer` objects.`
        *   `- [ ] Store these as `projectStore.stems.vocalsBuffer` and `projectStore.stems.drumsBuffer`.`
        *   `- [ ] Hide loading indicator and display success/error message.`
*   `Stem Management/Availability Indication:`
    *   `- [ ] UI elements related to stems (e.g., solo buttons, stem-specific analysis) should be enabled only after stems are successfully isolated and stored.`

### Story 2.3: As a Creator, I want to solo an isolated stem (e.g., vocals) and have the system detect and display its specific transients or amplitude ramps as markers so I can use these nuanced events for synchronization.
*   `Transient Detection WASM Module (for Stems & Master):`
    *   `- [X] (Rust/WASM package) Implement/integrate a transient detection algorithm (e.g., from Essentia.js or custom) as a Rust function `detect_transients(audio_data: Vec<f32>, sample_rate: f32) -> Vec<f64>`, returning transient timestamps.`
    *   `- [ ] (Rust/WASM package) Compile and expose this in the WASM module.`
    *   `- [ ] (Optional MVP - Amplitude Ramps) Research/implement simplified "amplitude ramp" or significant energy change detection in Rust/WASM. If too complex, defer post-MVP and focus on transients.`
*   `Frontend UI for Stem Controls & Analysis (`StemControls.svelte`):`
    *   `- [ ] Create `StemControls.svelte` section/tab within `AudioAnalysisControls.svelte` or as a dedicated part of the Right Side Panel.`
    *   `- [ ] Display available stems (e.g., "Vocals", "Drums") if `projectStore.stems` contains them.`
    *   `- [ ] For each available stem, add:
        *   `- [ ] A "Solo" button.`
        *   `- [ ] A "Detect Transients" button.`
        *   `- [ ] (Optional MVP) A "Detect Amplitude Ramps" button if implemented.`
    *   `- [ ] UI to indicate which stem (if any) is currently soloed.`
    *   `- [ ] UI to indicate which stem's markers are currently being viewed/are active (e.g., color coding on waveform).`
*   `Stem Soloing Logic:`
    *   `- [ ] In `playbackStore` or `projectStore`, add `soloedStem` (e.g., 'vocals', 'drums', null).`
    *   `- [ ] When a stem "Solo" button is clicked:
        *   `- [ ] Update `soloedStem` state.`
        *   `- [ ] Modify audio playback: if `soloedStem` is set, play the corresponding stem's `AudioBuffer` instead of the master track. If master track was playing, stop it and start stem playback from current time.`
        *   `- [ ] Ensure master track audio is effectively muted (or its `AudioBufferSourceNode` disconnected) when a stem is soloed.`
        *   `- [ ] Clicking "Solo" again on the same stem or a "Unsolo" button should revert to master track playback.`
*   `Frontend Logic for Stem Transient/Ramp Detection:`
    *   `- [ ] When "Detect Transients" for a stem is clicked:
        *   `- [ ] Show loading indicator.`
        *   `- [ ] Get the `AudioBuffer` for the selected stem.`
        *   `- [ ] Call the WASM `detect_transients` function.`
        *   `- [ ] Store results in `projectStore.stemMarkers.vocals.transients` or `projectStore.stemMarkers.drums.transients`.`
        *   `- [ ] Hide loading indicator.`
    *   `- [ ] (Optional MVP) Implement similar logic for amplitude ramp detection.`
*   `Waveform Display Enhancement for Stem Markers:`
    *   `- [ ] Modify `WaveformDisplay.svelte` to optionally display markers from a selected stem (e.g., vocal transients).`
    *   `- [ ] Ensure stem markers are visually distinct (different color/shape/vertical position) from master beat markers and other marker types.`
    *   `- [ ] Add UI (e.g., checkboxes or a dropdown near the waveform) to toggle visibility of different marker sets (master beats, master transients, vocal transients, etc.).`

### Story 2.4: As a Creator, I want the system to detect and display transient markers on the master audio track so I can identify sharp percussive or impactful sounds.
*   `Frontend UI for Master Transient Detection:`
    *   `- [ ] In `AudioAnalysisControls.svelte` (Audio Analysis section), add a "Detect Master Transients" button.`
    *   `- [ ] Add loading indicator UI.`
*   `Frontend Logic for Master Transient Detection:`
    *   `- [ ] When "Detect Master Transients" is clicked:
        *   `- [ ] Show loading indicator.`
        *   `- [ ] Get the master `AudioBuffer` and its sample rate.`
        *   `- [ ] Call the same WASM `detect_transients` function (from Story 2.3) with master audio data.`
        *   `- [ ] Store the results in `projectStore.masterTransientMarkers`.`
        *   `- [ ] Hide loading indicator.`
*   `Waveform Display Enhancement for Master Transients:`
    *   `- [ ] Ensure `WaveformDisplay.svelte` can render `projectStore.masterTransientMarkers`.`
    *   `- [ ] Style master transient markers distinctively (e.g., different color/shape from beat markers).`

### Story 2.5: As a Creator, I want to manually add, move, and delete custom markers on the audio timeline so I can pinpoint specific moments important to my edit.
*   `Frontend UI for Manual Marker Tools (`ManualMarkerTools.svelte`):`
    *   `- [ ] Create `ManualMarkerTools.svelte` section/tab in `AudioAnalysisControls.svelte` or Right Side Panel.`
    *   `- [ ] Add an "Add Marker at Playhead" button.`
    *   `- [ ] (Alternative UI) Implement an interaction like Alt/Cmd+click on `WaveformDisplay.svelte` to add a marker at the clicked time.`
    *   `- [ ] Add a "Delete Selected Marker" button (enabled when a marker is selected).`
*   `Waveform Display Interaction for Manual Markers:`
    *   `- [ ] Store custom markers in `projectStore.customMarkers` (array of objects, e.g., `{ id: uniqueId(), time: timestamp, selected: false, name: 'Custom 1' }`).`
    *   `- [ ] Render custom markers distinctively on `WaveformDisplay.svelte`.`
    *   `- [ ] Implement click-to-select for custom markers on the waveform (update `selected` state, ensure only one or multiple can be selected based on design).`
    *   `- [ ] Implement dragging of selected custom markers:
        *   `- [ ] On mousedown on a selected marker, initiate drag mode.`
        *   `- [ ] On mousemove, update its visual position and a temporary new time.`
        *   `- [ ] On mouseup, finalize the new time in `projectStore.customMarkers`.`
        *   `- [ ] Provide clear visual feedback during drag.`
    *   `- [ ] Implement deletion: "Delete Selected Marker" button removes selected markers from `projectStore.customMarkers`. `Delete` key press could also trigger this when a marker is selected and waveform area is focused.`
*   `Marker Data Management:`
    *   `- [ ] Ensure each custom marker has a unique ID for reliable updates and deletion.`
    *   `- [ ] (Optional MVP) Allow users to name/label custom markers via a small input field when a marker is selected or created.`

### Story 2.6 (Optional MVP): As a Creator, I want to see a basic transcription of my audio's lyrical content displayed alongside the timeline so I can reference it.
*(Assuming import of timed text file for "Optional MVP" simplicity)*
*   `Frontend UI for Transcription Import:`
    *   `- [ ] In `AudioAnalysisControls.svelte` or a new `TranscriptionControls.svelte` section, add an "Import Transcription" button.`
    *   `- [ ] Use a file input (`<input type="file" accept=".lrc, .srt">`) triggered by the button.`
*   `Frontend Logic for Transcription Parsing & Storage:`
    *   `- [ ] Implement a client-side JavaScript parser for LRC file format (lines like `[mm:ss.xx]lyric text`).`
    *   `- [ ] Implement a client-side JavaScript parser for basic SRT file format (sequence number, `HH:MM:SS,ms --> HH:MM:SS,ms`, text lines).`
    *   `- [ ] On file import, determine format, parse into an array of timed text objects (e.g., `{ startTime: seconds, endTime: seconds (for SRT), text: 'lyric line' }`).`
    *   `- [ ] Store this parsed data in `projectStore.transcriptionData`.`
*   `UI for Displaying Transcription (`TranscriptionDisplay.svelte`):`
    *   `- [ ] Create `TranscriptionDisplay.svelte` component.`
    *   `- [ ] Design its placement (e.g., a panel below the waveform or as an overlay).`
    *   `- [ ] During audio playback, `TranscriptionDisplay.svelte` should:
        *   `- [ ] Find the transcription line(s) from `projectStore.transcriptionData` whose `startTime` (and `endTime` for SRT) matches or contains `playbackStore.currentTime`.`
        *   `- [ ] Display the current lyric line, possibly highlighting it.`
        *   `- [ ] (Optional) Show a few upcoming/previous lines for context.`

## Epic 3: Real-Time Master Audio Manipulation

### Story 3.1: As a Creator, I want to adjust the overall tempo (BPM) of my master audio track in real-time so that I can change the song's speed without leaving the editor.
*   `Tempo Adjustment DSP Module (WASM with AudioWorklet):`
    *   `- [ ] (Rust/WASM package) Research and select/implement a pitch-preserving time-stretching algorithm (e.g., Phase Vocoder, PSOLA). Libraries like SoundTouch (if a WASM port like `soundtouchjs` is viable and performant) or `rubberbandjs` are options. This must be real-time capable.`
    *   `- [ ] (Rust/WASM package) Create a Rust struct/class that encapsulates the DSP state and has a method to process audio blocks, adjusting tempo based on a factor.`
    *   `- [ ] Compile this to WASM.`
    *   `- [ ] (Frontend) Create an `AudioWorkletProcessor` (`tempoPitchProcessor.js`) that loads and uses this WASM module.`
    *   `- [ ] The `AudioWorkletProcessor` should accept audio input, a tempo factor parameter, and output tempo-adjusted audio.`
*   `Frontend UI for Tempo Control (`TempoPitchControls.svelte`):`
    *   `- [ ] Create `TempoPitchControls.svelte` component (e.g., in Right Side Panel or near master playback controls).`
    *   `- [ ] Add UI elements: a slider and/or number input for tempo factor (e.g., 0.5x to 2.0x) or target BPM.`
    *   `- [ ] Display original detected/set BPM (from beat detection or user input) and current effective BPM.`
*   `Web Audio API Integration for Tempo Adjustment:`
    *   `- [ ] Register the `AudioWorkletNode` for `tempoPitchProcessor.js`.`
    *   `- [ ] Modify the master audio playback chain: `AudioBufferSourceNode` -> `TempoPitchWorkletNode` -> `AudioContext.destination`.`
    *   `- [ ] Store current tempo factor in `projectStore.tempoFactor` (default 1.0).`
    *   `- [ ] Send `projectStore.tempoFactor` to the `TempoPitchWorkletNode` as a parameter.`
*   `Real-time Control Logic:`
    *   `- [ ] When the tempo control UI changes, update `projectStore.tempoFactor`.`
    *   `- [ ] The `TempoPitchWorkletNode` should react to parameter changes in real-time.`
    *   `- [ ] Ensure latency is low (<100ms target for adjustment response).`
*   `Initial BPM Handling:`
    *   `- [ ] If beat detection (Story 2.1) provides an average BPM, use it to inform the initial display/setting of the tempo control.`
    *   `- [ ] Allow user to manually input/override the base BPM of the track if needed.`

### Story 3.2: As a Creator, I want all existing beat markers, transient markers, and user-defined markers on the timeline to dynamically rescale and maintain their relative positions when I change the master audio tempo.
*   `Marker Time Recalculation Logic:`
    *   `- [ ] Markers are stored with their original timestamps (in the context of the unmodified audio at 1.0x tempo).`
    *   `- [ ] Create a Svelte derived store or utility function that calculates the *displayed time* of each marker based on `projectStore.tempoFactor`. Displayed time = `originalTime / tempoFactor`.`
*   `Waveform Display Update for Rescaled Markers:`
    *   `- [ ] `WaveformDisplay.svelte` should use these calculated displayed times when rendering all types of markers (beat, transient, custom, stem-specific).`
*   `Timeline Visual Rescaling:`
    *   `- [ ] The total displayed duration of the audio on `WaveformDisplay.svelte`'s time axis must update based on `tempoFactor`. If original duration is `D`, new displayed duration is `D / tempoFactor`.`
    *   `- [ ] The playhead's visual speed across the timeline should reflect the tempo change (i.e., if tempo is 0.5x, playhead moves at half speed across the original visual representation, or the waveform is visually stretched and playhead moves at a 'normal' perceived rate over the stretched waveform. The latter is usually more intuitive). Ensure the visual representation of the waveform itself stretches/compresses to match the new effective duration, so the playhead always moves at a constant visual speed relative to the screen.`
    *   `- [ ] Zoom levels on the waveform must interact correctly with this rescaled timeline view.`
*   `State Management for Tempo/Time Mapping:`
    *   `- [ ] Ensure Svelte's reactivity automatically triggers re-rendering of markers and timeline scale when `projectStore.tempoFactor` changes.`

### Story 3.3: As a Creator, I want to adjust the overall pitch (key) of my master audio track in real-time so that I can change the song's key.
*   `Pitch Shifting DSP Integration in AudioWorklet:`
    *   `- [ ] (Rust/WASM package) Ensure the chosen DSP library/implementation (from Story 3.1) also supports independent pitch shifting (e.g., SoundTouchJS can do this).`
    *   `- [ ] (Rust/WASM package) Extend the Rust DSP struct/class to accept a pitch shift parameter (e.g., semitones) and apply it during audio processing.`
    *   `- [ ] (Frontend) Modify `tempoPitchProcessor.js` (AudioWorklet) to also accept a pitch shift parameter and pass it to the WASM module.`
*   `Frontend UI for Pitch Control:`
    *   `- [ ] In `TempoPitchControls.svelte`, add UI elements for pitch control: a slider and/or number input for semitones (e.g., -12 to +12).`
*   `Web Audio API Integration for Pitch Shifting:`
    *   `- [ ] Store current pitch shift amount (in semitones) in `projectStore.pitchShift` (default 0).`
    *   `- [ ] Send `projectStore.pitchShift` to the `TempoPitchWorkletNode` as another parameter.`
*   `Real-time Control Logic for Pitch:`
    *   `- [ ] When the pitch control UI changes, update `projectStore.pitchShift`.`
    *   `- [ ] The `TempoPitchWorkletNode` should react to pitch parameter changes in real-time, applying them without significantly affecting tempo.`
    *   `- [ ] Ensure low latency for adjustments.`

## Epic 4: Dynamic Marker-Driven Video Editing & Effects

### Story 4.1: As a Creator, I want to arrange multiple video clips in a sequence on a conceptual video track aligned with the master audio timeline so that I can define the order of my visual content.
*   `Video Sequence Timeline UI (`VideoTimeline.svelte`):`
    *   `- [ ] Create `VideoTimeline.svelte` component for the "Bottom Main Interactive Timeline" area in `MainEditingInterfaceView.svelte`.`
    *   `- [ ] This timeline should visually align its time axis with `WaveformDisplay.svelte` (respecting zoom, pan, and tempo-induced rescaling from Story 3.2).`
    *   `- [ ] For MVP, it will represent a single video track where clips are sequenced.`
*   `Data Structure for Video Sequence:`
    *   `- [ ] In `projectStore`, define `videoSequence` as an array of objects. Each object representing a clip instance on the timeline: `{ id: uniqueId(), assetId: 'video_asset_id_from_library', startTime: seconds, duration: seconds, originalClipStartTime: 0, originalClipDuration: videoAssetDuration }`.`
*   `Drag-and-Drop from Asset Library to Timeline:`
    *   `- [ ] Make video items in `AssetLibrary.svelte` draggable (HTML Drag and Drop API). Store `assetId` in `event.dataTransfer`.`
    *   `- [ ] Implement `VideoTimeline.svelte` as a drop zone.`
    *   `- [ ] On drop:
        *   `- [ ] Get `assetId` and determine `startTime` based on drop position on the timeline (convert pixel position to time, considering current zoom/pan/tempoFactor).`
        *   `- [ ] Get the full duration of the video asset from `projectStore.videoAssets`.`
        *   `- [ ] Add a new clip instance to `projectStore.videoSequence` with this data.`
    *   `- [ ] Visually render clip instances on `VideoTimeline.svelte` as blocks (show thumbnail snippet or name). Style these blocks.`
*   `Clip Manipulation on Timeline:`
    *   `- [ ] Implement dragging of existing clip instances on `VideoTimeline.svelte` to change their `startTime` (reordering). Prevent overlaps for MVP or define simple overlap handling (e.g., push).`
    *   `- [ ] Implement resizing of clip instances by dragging their start/end edges:
        *   `- [ ] Dragging start edge changes `startTime` and `originalClipStartTime` (trim from start).`
        *   `- [ ] Dragging end edge changes `duration` (trim from end).`
        *   `- [ ] Ensure `duration` does not exceed `originalClipDuration - originalClipStartTime`.`
    *   `- [ ] Implement deletion of clip instances from the sequence (e.g., select and press Delete key, or context menu option).`
*   `Visual Feedback:`
    *   `- [ ] Highlight the clip instance on `VideoTimeline.svelte` that corresponds to the video currently playing in `VideoPreview.svelte` (using a bright neon accent color outline as per UI/UX Spec).`
*   `Playback Logic Update for Sequenced Video:`
    *   `- [ ] Modify `VideoPreview.svelte`'s logic:
        *   `- [ ] During audio playback, determine which clip instance in `projectStore.videoSequence` should be playing based on `playbackStore.currentTime` (adjusted for `tempoFactor`).`
        *   `- [ ] If the active clip changes:
            *   `- [ ] Load the new video asset (identified by `assetId`) into the hidden `videoTextureSource`.`
        *   `- [ ] Set `videoTextureSource.currentTime` to `(playbackStore.currentTime / tempoFactor - clipInstance.startTime) + clipInstance.originalClipStartTime`. Ensure this is clamped within the clip's trimmed duration.`
        *   `- [ ] Handle gaps between clips (show black or last frame, TBD - black for MVP).`

### Story 4.2: As a Creator, I want to define distinct sections within my audio track (e.g., "verse 1," "chorus 1," "instrumental break") so I can apply different synchronization logic to each section.
*   `Data Structure for Audio Sections:`
    *   `- [ ] In `projectStore`, define `audioSections` as an array of objects: `{ id: uniqueId(), name: 'Section 1', startTime: seconds, endTime: seconds, activeMarkerSource: null, syncRule: {}, effectRule: {}, speedRampRule: {} }`. Start/end times are relative to original audio (1.0x tempo).`
*   `UI for Section Definition on Waveform Display:`
    *   `- [ ] Enhance `WaveformDisplay.svelte` to allow creating and manipulating sections.`
    *   `- [ ] Implement a "Create Section" mode/tool: User selects a time range (e.g., by dragging on a dedicated row above/below the waveform or using handles) and then confirms.`
    *   `- [ ] Visually represent sections on/near the waveform (e.g., colored blocks with their names). Displayed start/end times must respect `tempoFactor`.`
    *   `- [ ] Allow users to click a section to select it for editing its properties (name, rules) in the Right Side Panel.`
    *   `- [ ] Allow users to drag section boundaries (start/end handles) to adjust their times.`
    *   `- [ ] Allow users to delete sections.`
    *   `- [ ] Implement UI for naming/renaming sections (e.g., in Right Side Panel when a section is selected).`

### Story 4.3: As a Creator, for each defined audio section, I want to select which set of audio markers (e.g., master beats, soloed vocal transients, drum transients, general BPM) will actively drive the video editing decisions for that section.
*   `UI for Marker Source Selection per Section (`SectionSyncRules.svelte`):`
    *   `- [ ] Create `SectionSyncRules.svelte` component for the "Synchronization Rules" part of the Right Side Panel.`
    *   `- [ ] When an audio section is selected (from Story 4.2), `SectionSyncRules.svelte` should display its properties.`
    *   `- [ ] Add a dropdown menu in `SectionSyncRules.svelte` labeled "Driving Audio Feature" or similar.`
    *   `- [ ] Populate this dropdown with available marker/audio feature sources:
        *   `- [ ] "Master Beats" (from `projectStore.masterBeatMarkers`)`
        *   `- [ ] "Master Transients" (from `projectStore.masterTransientMarkers`)`
        *   `- [ ] "Vocal Transients" (if available from `projectStore.stemMarkers.vocals.transients`)`
        *   `- [ ] "Drum Transients" (if available from `projectStore.stemMarkers.drums.transients`)`
        *   `- [ ] "BPM Pulse" (a synthetic beat track based on current BPM)`
        *   `- [ ] (Later for speed/effects) "Vocal Amplitude", "Drum Amplitude", etc.`
    *   `- [ ] When a source is selected, store its identifier (e.g., 'masterBeats') in the `activeMarkerSource` property of the selected section object in `projectStore.audioSections`.`

### Story 4.4: As a Creator, I want the system to automatically switch between video clips in my sequence based on the rules and active audio markers I've set for the current audio section (e.g., "switch on every 4th master beat," "switch on every vocal transient").
*   `Rule Definition UI per Section:`
    *   `- [ ] In `SectionSyncRules.svelte`, when `activeMarkerSource` is set for a section, show relevant rule options for video switching:`
        *   `- [ ] A number input for "Switch on every Nth marker event" (e.g., N=1, 2, 4).`
        *   `- [ ] Store this rule (e.g., `{ type: 'everyNthMarker', value: N }`) in the `syncRule.videoSwitch` property of the section object.`
*   `Video Switching Logic During Playback:`
    *   `- [ ] In the main playback loop (e.g., `requestAnimationFrame`):
        *   `- [ ] Determine the current audio section based on `playbackStore.currentTime` (adjusted for `tempoFactor`) and `projectStore.audioSections`.`
        *   `- [ ] If the current section has a `syncRule.videoSwitch` defined:
            *   `- [ ] Get the relevant marker timestamps for that section's `activeMarkerSource`. Adjust these timestamps for `tempoFactor` to get displayed times.`
            *   `- [ ] Maintain a counter for "Nth event" logic within the current section's playback.`
            *   `- [ ] Identify the *next* marker event time that should trigger a switch based on the rule.`
            *   `- [ ] If `playbackStore.currentTime` passes a trigger time:
                *   `- [ ] Select the *next* video clip from `projectStore.videoSequence` to switch to. (Simple: cycle through. Advanced: consider user arrangement on timeline). For MVP, let's assume it means we switch to the next clip *instance* placed on the `VideoTimeline.svelte`.
                *   `- [ ] Update `projectStore.activeVideoAssetId` (or whichever variable controls the current video in `VideoPreview.svelte`) to the asset ID of this next clip instance.
                *   `- [ ] The playback logic in Story 4.1 should handle loading and seeking this new clip instance.
*   `State Management for Switching:`
    *   `- [ ] Add `currentVideoSequenceIndex` to `playbackStore` or `projectStore` to track the index of the currently playing clip instance from `projectStore.videoSequence`.`
    *   `- [ ] Reset Nth event counters when entering a new audio section or when playback loops/restarts.`

### Story 4.5: As a Creator, I want to dynamically control the playback speed of my video clips (e.g., create speed ramps) based on characteristics derived from a selected audio source (like vocal amplitude ramps from a soloed stem) for the current audio section.
*   `Audio Characteristic Extraction (Real-time):`
    *   `- [ ] (Rust/WASM or JS in AudioWorklet) Implement a function/module to extract a real-time smoothed amplitude envelope (e.g., RMS) from an audio stream (master or a stem).
        *   `- [ ] This should be part of `tempoPitchProcessor.js` or a new `AudioCharacteristicExtractorWorkletNode`.`
        *   `- [ ] The worklet should output this characteristic value (e.g., normalized 0-1) frequently.`
    *   `- [ ] Store the current characteristic value (e.g., `projectStore.activeAudioCharacteristicValue`).`
*   `UI for Selecting Audio Source & Mapping for Speed Ramps:`
    *   `- [ ] In `SectionSyncRules.svelte` for a selected audio section:
        *   `- [ ] Add UI to select an audio characteristic source for speed ramps (e.g., "Master Amplitude", "Vocal Stem Amplitude").`
        *   `- [ ] Add UI to define mapping: "Min Speed" (e.g., 0.5x), "Max Speed" (e.g., 2.0x), and whether low amplitude means min speed or max speed (invert).`
        *   `- [ ] Store this config in `section.speedRampRule = { source: 'vocalAmplitude', minSpeed: 0.5, maxSpeed: 2.0, invert: false }`.`
*   `Video Speed Control Logic:`
    *   `- [ ] During playback, if current audio section has a `speedRampRule`:
        *   `- [ ] Get the real-time audio characteristic value (e.g., from `projectStore.activeAudioCharacteristicValue`).`
        *   `- [ ] Map this value (0-1) to a video playback speed factor using `minSpeed`, `maxSpeed`, and `invert` from `speedRampRule`.`
        *   `- [ ] Update `videoTextureSource.playbackRate` with this calculated speed factor.`
    *   `- [ ] (Alternative if `<video>.playbackRate` is not smooth enough or WebCodecs is adopted): Adjust frame advancement rate in `VideoPreview.svelte` based on this speed factor.`

### Story 4.6: As a Creator, I want to apply at least one basic real-time visual effect (e.g., a color filter) to my video, and have its intensity or parameters be modulated by the selected active audio markers or characteristics for the current audio section.
*   `Basic WebGL2 Shader Effects Implementation:`
    *   `- [ ] Choose 1-2 basic effects (e.g., Brightness/Contrast, Color Tint/Hue Shift, simple Displacement/Glitch).`
    *   `- [ ] Write/adapt GLSL fragment shaders for these effects. Each shader needs uniform(s) for parameter control (e.g., `uniform float u_brightness;`, `uniform vec3 u_tintColor;`).`
    *   `- [ ] Modify `VideoPreview.svelte`'s WebGL rendering:
        *   `- [ ] Allow swapping the fragment shader or adding an effect pass.`
        *   `- [ ] Pass the necessary uniform values to the active effect shader.`
*   `UI for Effect Selection and Parameter Modulation (`SectionEffectRules.svelte`):`
    *   `- [ ] Create `SectionEffectRules.svelte` in Right Side Panel.`
    *   `- [ ] When an audio section is selected:
        *   `- [ ] Allow user to choose an effect from the available list.`
        *   `- [ ] For the selected effect, allow choosing an audio driver for its main parameter (e.g., "Modulate Brightness with Master Beat Pulses", "Modulate Tint Alpha with Vocal Amplitude").
            *   `- [ ] Driver options: Marker events (like from Story 4.4) or continuous characteristics (like from Story 4.5).`
        *   `- [ ] Add UI for mapping: min/max effect parameter value, attack/decay for pulse-driven effects.`
        *   `- [ ] Store config in `section.effectRule = { effect: 'brightness', driver: 'masterBeats', strength: 0.5, attack: 0.05, decay: 0.2 }`.`
*   `Effect Modulation Logic:`
    *   `- [ ] During playback, if current audio section has an `effectRule`:
        *   `- [ ] Determine the modulation value based on the `driver`:
            *   `- [ ] If marker-driven: Generate a transient envelope (e.g., 1.0 on marker, then decay based on `attack`/`decay` times) for the effect parameter.`
            *   `- [ ] If characteristic-driven: Use the real-time audio characteristic value, mapped via `strength`.`
        *   `- [ ] Calculate the final effect shader uniform value.`
        *   `- [ ] Update the corresponding uniform in the WebGL shader program in `VideoPreview.svelte` before rendering the frame.`
*   `Applying/Removing Effects:`
    *   `- [ ] Ensure effects are only active for their designated audio sections. When exiting a section, reset effect parameters or disable the effect shader pass.`

## Epic 5: Basic Project Export

### Story 5.1: As a Creator, I want to initiate an export process for my current audio-visual sequence so that I can share a preview.
*   `Export View UI (`ExportView.svelte` - [EXPORT] Mode):`
    *   `- [ ] Ensure `ExportView.svelte` (created in Story 1.1) is accessible via the "EXPORT" Mode Tab.`
    *   `- [ ] Add a "Start Export" button.`
    *   `- [ ] Add UI elements to display export progress (e.g., progress bar, status messages like "Preparing audio...", "Rendering video frame X of Y...").`
    *   `- [ ] (Optional MVP) Basic export settings: filename input. Default to common format (e.g., MP4 if feasible, WebM otherwise).`
*   `Initiate Export Logic:`
    *   `- [ ] When "Start Export" is clicked:
        *   `- [ ] Disable editing UI elements to prevent changes during export.`
        *   `- [ ] Transition UI to an "Exporting..." state, showing progress elements.`
        *   `- [ ] Gather all necessary data: `projectStore` (master audio info, video sequence, audio sections with rules, tempo/pitch settings).`

### Story 5.2: As a Creator, I want the exported video to include the synchronized audio, all applied video edits (cuts, speed ramps), and basic visual effects, with a visible watermark.
*   `Offline Audio Rendering:`
    *   `- [ ] Create a function to render the full master audio track with applied tempo and pitch changes (from Story 3.1, 3.3) into a new offline `AudioBuffer`.
        *   `- [ ] This involves setting up an `OfflineAudioContext`, connecting the `AudioBufferSourceNode` to the `TempoPitchWorkletNode`, and rendering the output.`
*   `Offline Video Frame Rendering Setup:`
    *   `- [ ] Create an offscreen HTML `<canvas>` element for rendering export frames.`
    *   `- [ ] Initialize a WebGL2 context on this offscreen canvas with the same shaders and capabilities as `VideoPreview.svelte`.`
    *   `- [ ] Create a hidden HTML `<video id="exportVideoSource">` element for fetching frames from video files.`
*   `Frame-by-Frame Rendering Loop for Export:`
    *   `- [ ] Calculate total export duration based on master audio length and tempo factor.`
    *   `- [ ] Determine export frame rate (e.g., 30fps).`
    *   `- [ ] Loop from time `t = 0` to `totalDuration`, incrementing by `1/fps`:
        *   `- [ ] For each frame time `t`:`
            *   `- [ ] **Determine Video Content:**
                *   `- [ ] Find the current audio section and its rules.`
                *   `- [ ] Identify the correct video clip instance from `projectStore.videoSequence` for time `t`.`
                *   `- [ ] Calculate its effective playback speed based on `speedRampRule` and audio characteristic at time `t`.`
                *   `- [ ] Load the correct video asset into `exportVideoSource`.`
                *   `- [ ] Seek `exportVideoSource` to the precise frame needed within that clip, considering its start time in sequence, original clip start time, and dynamic playback speed up to time `t`. This is complex and needs careful calculation.`
            *   `- [ ] **Render to Offscreen Canvas:**
                *   `- [ ] Once `exportVideoSource` has the frame (`seeked` event), draw it to the offscreen WebGL canvas.`
                *   `- [ ] Apply visual effects (from `effectRule`) by setting shader uniforms based on audio driver at time `t` and render.`
            *   `- [ ] **Add Watermark:**
                *   `- [ ] Draw a watermark (text or image) onto the offscreen WebGL canvas (or 2D context overlay if simpler) over the rendered video frame.`
            *   `- [ ] **Capture Frame:** (Details in Story 5.3 for MediaRecorder)
                *   `- [ ] Feed this rendered frame from the offscreen canvas to the video encoder.`
            *   `- [ ] Update export progress UI.`
*   `Asynchronous Frame Fetching:`
    *   `- [ ] The process of seeking video elements and waiting for frames is asynchronous. The loop must manage this, e.g., using async/await or promises to ensure frames are rendered in order.`

### Story 5.3: As a Creator, I want the export to be processed client-side and be available as a downloadable file in a common web format (e.g., MP4).
*   `Video Stream Generation for Encoder:`
    *   `- [ ] Use `offscreenCanvas.captureStream(fps)` to get a `MediaStreamTrack` for video.`
*   `Audio Track for Encoder:`
    *   `- [ ] Get the `AudioBuffer` of the fully processed (tempo/pitch adjusted) master audio from Story 5.2.`
    *   `- [ ] Create a `MediaStreamAudioDestinationNode` from an `AudioContext`.`
    *   `- [ ] Play the processed `AudioBuffer` through an `AudioBufferSourceNode` connected to this destination node.`
    *   `- [ ] Get the audio `MediaStreamTrack` from `MediaStreamAudioDestinationNode.stream.getAudioTracks()[0]`.`
*   `Combining Streams & Encoding with MediaRecorder:`
    *   `- [ ] Create a new `MediaStream` from the video track and the audio track.`
    *   `- [ ] Initialize `MediaRecorder` with this combined stream.
        *   `- [ ] MIME Type: Try `video/mp4; codecs="avc1.42E01E, mp4a.40.2"`. If browser support is problematic/inconsistent for MP4, fall back to `video/webm; codecs="vp8, opus"` or similar WebM as the MVP target, clearly noting MP4 as a stretch/post-MVP if `ffmpeg.wasm` is needed for reliable MP4.
    *   `- [ ] Create an array `recordedChunks = []`.`
    *   `- [ ] `mediaRecorder.ondataavailable = event => { if (event.data.size > 0) recordedChunks.push(event.data); }`.`
    *   `- [ ] `mediaRecorder.onstop = () => { /* ... handle blob creation and download ... */ }`.`
    *   `- [ ] Start `mediaRecorder.start()`. The frame-by-frame rendering loop (Story 5.2) drives the content into the canvas stream.`
*   `Finalizing Export and Download:`
    *   `- [ ] After the rendering loop finishes, call `mediaRecorder.stop()`.`
    *   `- [ ] In the `onstop` handler:
        *   `- [ ] Create a single `Blob` from `recordedChunks` with the correct MIME type.`
        *   `- [ ] Create an object URL: `const url = URL.createObjectURL(blob);`.`
        *   `- [ ] Create a temporary `<a>` element, set `a.href = url`, `a.download = "artivus-export.mp4"` (or `.webm`).`
        *   `- [ ] Programmatically click the `<a>` element: `a.click()`.`
        *   `- [ ] Revoke the object URL: `URL.revokeObjectURL(url);`.`
    *   `- [ ] Update UI: "Export Complete!", re-enable editing UI.`
*   `Error Handling & Resource Cleanup during Export:`
    *   `- [ ] Implement try/catch blocks for export operations.`
    *   `- [ ] If an error occurs, stop MediaRecorder, clean up resources, and display an error message.`
    *   `- [ ] Ensure offscreen canvas, contexts, and video elements used for export are properly disposed of.`
*   `(Alternative) ffmpeg.wasm for MP4 Export:`
    *   `- [ ] (Stretch/Research) If `MediaRecorder` MP4 output is unreliable:
        *   `- [ ] Integrate `ffmpeg.wasm`. This is a large dependency.`
        *   `- [ ] The rendering loop would save individual frames (e.g., as PNGs/JPEGs in memory or IndexedDB) and the final audio as WAV.`
        *   `- [ ] After rendering, use `ffmpeg.wasm` to combine these frames and the audio into an MP4 file.` This significantly increases complexity and export time.

## Non-Functional Requirements (NFRs) - To Be Addressed Throughout

### Performance
*   `- [ ] (S3.1, S3.3) Benchmark and optimize real-time audio manipulations (pitch/tempo) for <100ms response.`
*   `- [ ] (S1.5, S4.6) Monitor and optimize video playback and real-time effect rendering for >=30fps on target desktop hardware.`
*   `- [ ] (S2.1, S2.2) Benchmark and optimize audio analysis tasks (beat detection, stem isolation) to complete within 1-2 minutes for a 3-4 minute song (MVP target).`
*   `- [ ] (General) Profile and optimize WASM module performance (CPU, memory).`
*   `- [ ] (General) Optimize Svelte component rendering and updates; minimize re-renders.`

### Usability & Learnability
*   `- [ ] (General) Conduct informal usability checks of the core workflow during and after each Epic completion.`
*   `- [ ] (General) Ensure all UI controls provide clear visual feedback for user actions and system processes (loading states, success, errors).`

### Reliability & Stability
*   `- [ ] (General) Test with various media file sizes and typical short-form content lengths (e.g., up to 5 minutes).`
*   `- [ ] (General) Implement robust error handling and state recovery for critical operations (file I/O, analysis, export).`
*   `- [ ] (General) Ensure application does not crash or lose significant data during common user interactions.`

### Browser Compatibility
*   `- [ ] (Ongoing) Develop primarily against one modern browser (e.g., Chrome).`
*   `- [ ] (End of MVP) Conduct focused testing and bug fixing for latest stable versions of Chrome, Firefox, Edge, Safari (desktop).`
*   `- [ ] (Ongoing) Check caniuse.com and MDN for Web API compatibility (WebGL2, WebCodecs - if used, Web Audio API, MediaRecorder).`

### Security
*   `- [ ] (S1.2, S1.4 - Backend) Implement basic input validation and sanitization for any data received by backend endpoints.`
*   `- [ ] (S1.2, S1.4 - Backend) Configure appropriate HTTP security headers (e.g., CSP, X-Content-Type-Options) on the backend, if serving any HTML directly (less relevant for SPA + API).`
*   `- [ ] (Frontend) Ensure user-generated content displayed in the UI (e.g., filenames, marker names) is properly escaped if it's not inherently safe by Svelte's rendering.`

### Scalability (Initial Considerations)
*   `- [ ] (Architectural) Ensure WASM modules for heavy client-side tasks are well-encapsulated, facilitating potential future migration of these tasks to a backend if needed (though MVP is client-focused).`

### Accessibility (AX)
*   `- [ ] (General) Throughout UI development, ensure all interactive elements are keyboard navigable and operable.`
*   `- [ ] (General) Ensure sufficient color contrast for text and meaningful UI elements as per WCAG 2.1 AA guidelines.`
*   `- [ ] (General) Add ARIA attributes where necessary to improve semantics for assistive technologies (e.g., for custom controls, progress bars, alerts).`
*   `- [ ] (General) Ensure visual focus indicators are clear for keyboard users.`

### Testing (General Approach)
*   `- [ ] (Ongoing) Write unit tests (Vitest/Jest) for critical utility functions, Svelte component logic, and Rust/WASM module functions as they are developed.`
*   `- [ ] (Epic Completion) Write integration tests for key interactions between components (e.g., audio analysis module -> timeline UI, marker selection -> rule application).`
*   `- [ ] (End of MVP) Develop a small suite of End-to-End (E2E) tests (e.g., using Playwright or Cypress) for critical user flows:
    *   `- [ ] Flow 1: Upload audio & video, basic beat sync, play preview.`
    *   `- [ ] Flow 2: Apply tempo change, see markers rescale.`
    *   `- [ ] Flow 3: Define sections, apply marker-driven video switching, export preview.`
*   `- [ ] (Technical Evaluation) Evaluate if HTML `<video>` element as a texture source for WebGL and for `playbackRate` manipulation is sufficient for MVP performance and control, or if a switch to WebCodecs for decoding is necessary for core video features. Document decision.`

---