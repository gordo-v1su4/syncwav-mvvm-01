Okay, here's a condensed analysis of the Syncwave Editor codebase:

The project is a web-based video editor with a React frontend (built with Vite, styled by Tailwind CSS and shadcn/ui components) and an Express.js backend.

**Core Frontend Structure & Interaction:**

*   **UI Components (`src/components/ui/`):** These are reusable, styled wrappers around Radix UI primitives (e.g., Button, Slider, Dialog). They use `cva` for variants and `cn` (clsx + tailwind-merge) for class management.
*   **Main Page (`src/pages/Index.tsx`):** This is the central orchestrator. It manages application state (video clips, selected video, playback status, effect parameters, audio markers) using React hooks. It handles:
    *   **Video Upload & Processing:** Uses `VideoService` to send files to the backend for FFmpeg processing. Preloads processed videos and displays them as thumbnails using `VideoThumbnail`.
    *   **Audio Handling & Beat Detection:** Uses the `Timeline` component, which in turn uses `AudioAnalyzer` (with Meyda.js) to detect beats and musical key from uploaded audio. Detected beat markers are stored and used for synchronization. `WaveformDisplay` (with Wavesurfer.js) visualizes the audio.
    *   **Playback Synchronization:** A core `useEffect` hook in `Index.tsx` synchronizes audio playback with video clip switching. It listens to the audio's `timeupdate` and switches video sources based on beat markers and the user-defined "beats per shot" setting. It also manages video preloading and resumes playback from stored positions for each clip.
    *   **Real-time Effects:** Another `useEffect` applies jump cut and speed ramp effects (controlled by `VideoEffects.tsx`) to the main video during playback using `requestAnimationFrame`.
*   **Specialized Components (`src/components/`):**
    *   `Timeline.tsx`: Integrates audio upload, beat analysis controls (`BeatControls`), waveform display (`WaveformDisplay`, `StemWaveform`), and stem splitting initiation.
    *   `VideoEffects.tsx`: Provides UI (sliders) to control parameters for speed ramp, jump cuts, and beats per shot.
    *   `AudioAnalyzer.tsx`: Uses Meyda.js for client-side beat detection, BPM, and key analysis.
    *   `VideoThumbnail.tsx`: Generates and displays video thumbnails.

**Backend (`server/server.js`):**

*   An Express.js server handles video operations.
*   **Video Upload:** Uses `multer` to accept video file uploads.
*   **Video Processing:** Uses `fluent-ffmpeg` to process uploaded videos (e.g., re-encode, apply speed changes) based on options (partially derived from `config/video-processing.xml`). Processed files are stored in `server/uploads/processed/`.
*   **File Serving:** Serves processed videos.
*   **Cleanup:** Clears temporary upload and processed directories on startup.
*   **CORS & Security Headers:** Configured for cross-origin requests, important for client-side media handling.

**Key Modules:**

*   **Video Module (`src/modules/video/lib/video.service.ts`):** The `VideoService` class acts as an intermediary between the frontend and the backend video processing API (`/process-video`). It handles file uploads via `fetch` and manages video preloading.
*   **Stem Splitting Module (`src/modules/stem-splitting/`):** `StemSplitterService` interacts with an external API (`arpeggi.io`) for audio source separation, using an API key from environment variables.
*   **FFmpeg (`public/ffmpeg/ffmpeg-core.js`):** A client-side WebAssembly build of FFmpeg. While present and configured in Vite, it's not the primary video processing method in the current main workflow, which relies on the backend.

**Configuration (`config/*.xml`):**

*   XML files store settings:
    *   `editing-logic.xml`: Parameters for video effects (speed ramp, jump cuts) and beat-based editing logic.
    *   `video-processing.xml`: FFmpeg options for backend video processing.
    *   `project-structure.xml`: Meta-documentation of the codebase.
    *   `server-config.xml`: (Currently empty) Intended for server settings.

**Package Management:**

*   The project uses `pnpm` for the frontend (root `pnpm-lock.yaml`).
*   The `server` directory has its own `package.json` and `package-lock.json` (npm) and also a `pnpm-lock.yaml`, indicating potentially mixed or transitioning dependency management for the backend. The root `package.json` uses `concurrently` to start both frontend and backend servers.

**Overall Workflow (Simplified):**

1.  User uploads audio (client-side analysis with Meyda.js for beats) and videos.
2.  Videos are sent to the backend, processed by FFmpeg, and URLs returned.
3.  Frontend preloads videos and stores their last playback positions.
4.  During playback, `Index.tsx` switches video clips based on audio beat markers and the "beats per shot" setting.
5.  Effects like speed ramp and jump cuts are applied client-side in real-time.
6.  Stem splitting, if used, calls an external API.