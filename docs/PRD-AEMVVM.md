# Artivus Engine Product Requirements Document (PRD)

## 1. Goal, Objective and Context

Artivus Engine is a paradigm-shifting, browser-based audio-visual creation suite designed to intuitively edit video clips in deep synchronization with music. Its primary goal is to offer an unparalleled real-time, AI-assisted editing experience where video cuts and effects are intricately synchronized to nuanced musical elements.

The core problem it addresses is the difficulty creators (music video artists, dancers, choreographers, producers of short-form musically-driven commercial content) face in achieving a professional, dynamic, and musically-attuned edit without extensive manual effort. Artivus Engine empowers these creators by making the 'first edit' dramatically easier and faster, potentially enabling a 'one-shot' creation experience.

The vision is to revolutionize how these creators bring their audio-visual ideas to life by combining a reactive Svelte UI with cutting-edge, low-latency audio/video processing, deep audio intelligence, and GPU-accelerated visual effects.

## 2. Functional Requirements (MVP)

The MVP will deliver the following core functional capabilities, as outlined in the Project Brief:

- **Core Media Ingest & Synchronized Playback:** Users can upload audio and video, view interactive audio waveforms, and play video synchronized with a master audio track.
- **Advanced Audio Analysis & Interactive Marker System:** The system will perform automated beat detection, isolate at least two key stems (e.g., vocals, drums), perform transient detection on master/stems, allow users to solo stems for marker generation, manage multiple marker sets, and manually manage markers. *(Optional MVP: basic transcription display).*
- **Real-Time Master Audio Manipulation:** Users can adjust master audio tempo and pitch in real-time, with dynamic rescaling of the timeline and all markers.
- **Dynamic Marker-Driven Video Editing:** Users can arrange video sequences, define audio sections, select which audio markers/characteristics drive video dynamics (clip switching, speed ramps) per section.
- **Essential Real-Time Video Effects:** The system will render video via WebGL2 and allow application and audio-driven modulation of 1-2 basic shader-based visual effects.
- **Basic Project Export:** Users can export a watermarked preview of their synchronized audio-visual work.

## 3. Non-Functional Requirements (MVP)

### Performance
- Real-time audio manipulations (pitch/tempo) should exhibit low latency (target <100ms response for adjustments).
- Video playback and real-time effect rendering should maintain a smooth frame rate (target 30fps minimum) on target hardware.
- Audio analysis tasks (beat detection, initial stem isolation) should complete within a reasonable timeframe for typical song lengths (e.g., under 1-2 minutes for a 3-4 minute song for MVP).

### Usability & Learnability
- The core workflow for creating a simple synchronized music video should be intuitive enough for a new target user to complete a basic project within one session (e.g., < 1 hour) with minimal guidance.
- The user interface should be clean, responsive, and provide clear feedback for user actions and system processes.

### Reliability & Stability
- The application should handle typical media file sizes and project complexity for short-form content without crashing or significant data loss.
- Core features (playback, sync, export) should function reliably.

### Browser Compatibility
- The MVP must function correctly on the latest stable versions of modern desktop browsers (e.g., Chrome, Firefox, Edge, Safari) that support the required Web APIs (WebGL2, WebCodecs, Web Audio API).

### Security
- User-uploaded media should be handled securely, preventing unauthorized access.
- Standard web security best practices (e.g., XSS prevention, CSRF if applicable) must be implemented.

### Scalability (Initial Considerations)
- While the MVP focuses on client-side processing, architectural choices should not inherently prevent future scalability (e.g., offloading tasks to a backend as outlined in Post-MVP).

## 4. User Interaction and Design Goals

The primary goal is to create an intuitive, inspiring, and highly responsive editing experience that feels deeply connected to the music.

- **Overall Vision & Experience:** The application should feel modern, fluid, and powerful, yet approachable. It should empower creativity by making complex A/V synchronization tasks feel effortless and "magical."
- **Key Interaction Paradigms:**
  - Direct manipulation of timeline elements (markers, clips, audio sections).
  - Real-time feedback for all audio and video adjustments.
  - Clear visualization of audio analysis results (beats, transients, stems, waveforms).
  - Simple yet expressive controls for linking audio characteristics to video dynamics and effects.
- **Core Screens/Views (Conceptual for MVP):**
  - **Project/Media Management View:** For uploading and selecting audio/video assets.
  - **Main Editing Interface:** Dominant timeline, waveform display, video preview, stem controls, marker controls, effect controls.
  - **Export View:** Simple options for preview export.
- **Accessibility Aspirations (MVP):** While full accessibility is a larger goal, the MVP should strive for keyboard navigability for primary controls and ensure sufficient color contrast in the UI.
- **Branding Considerations:** Clean, professional aesthetic, potentially inspired by "rust-peaks" as mentioned in the initial vision.
- **Target Devices/Platforms:** Primarily web desktop for the MVP, optimized for common screen resolutions.

## 5. Technical Assumptions

- **Frontend Framework:** Svelte with Vite for the build system.
- **Core Logic & Performance:** Rust compiled to WebAssembly (WASM) for performance-critical audio analysis, DSP, and potentially other demanding tasks. Libraries like Essentia.js (WASM) might be leveraged.
- **Rendering & Visual Effects:** WebGL2 for video rendering and shader-based effects, with a view to WebGPU for future enhancements.
- **Media Handling (Client-Side):** WebCodecs API for efficient video frame access. For the audio timeline, waveform display, and sequencing, robust solutions (JavaScript or Rust-based) offering "DAW-level" features will be explored and selected.
- **Backend Service (MVP Minimal):** Primarily for media uploads and potentially initial normalization if client-side handling proves insufficient for certain formats. The choice between Rust (Actix/Axum) or Node.js/Express for this minimal backend will be determined during architectural design.
- **State Management:** Svelte stores, potentially augmented if MVP complexity demands.
- **Repository & Service Architecture Decision (Initial Proposal for Discussion):**
  - A Monorepo structure is proposed for the MVP to simplify initial setup, build processes, and cross-component type sharing between the Svelte frontend and any Rust/WASM modules.
  - The backend service for MVP will be a simple Monolithic service focused on the limited scope of media upload/normalization. (This is an initial proposal and will be finalized by the Architect based on further analysis.)
- **Testing Requirements (Initial Proposal):**
  - **Unit Tests:** For individual functions, Svelte components, and Rust/WASM modules.
  - **Integration Tests:** For interactions between key components (e.g., audio analysis module and timeline UI, video effect application).
  - **End-to-End (E2E) Tests:** For critical user flows like uploading media, applying sync, and exporting a preview. *(Specific tools and detailed strategy to be defined by the Architect.)*

## 6. Epic Overview

*(Note: User Stories below are illustrative for the Outcome-Focused approach. Acceptance Criteria are high-level for this initial PRD draft and will be further detailed.)*

### Epic 1: Project Foundation & Core Media Handling

**Goal:** Establish the initial Svelte application structure, integrate Vite, set up the main UI layout, and enable users to upload, manage, and perform basic synchronized playback of one audio and one video file with waveform display.

**User Stories:**
- **Story 1.1:** As a Creator, I want to set up a new project in Artivus Engine so that I can start working on my audio-visual piece.  
  **ACs:** New project can be initiated. Basic application shell loads.
- **Story 1.2:** As a Creator, I want to upload a primary audio track (e.g., MP3, WAV) into my project so that I can use it as the basis for my synchronization.  
  **ACs:** Audio file can be selected and uploaded. Upload progress is shown. Audio is accessible for playback.
- **Story 1.3:** As a Creator, I want to see an interactive waveform display of my uploaded audio track so that I can visually understand its structure and navigate it.  
  **ACs:** Waveform is rendered for the uploaded audio. Controls for play, pause, seek, and zoom on the waveform are functional.
- **Story 1.4:** As a Creator, I want to upload at least one video clip (e.g., MP4) into my project so that I can synchronize it with my audio.  
  **ACs:** Video file can be selected and uploaded. A thumbnail or representation of the video is shown.
- **Story 1.5:** As a Creator, I want to play my uploaded video clip in synchronization with the master audio track, controlled by the main audio playback controls.  
  **ACs:** Video playback starts/stops/seeks in sync with the audio waveform player.

### Epic 2: Foundational Audio Analysis & Marker System

**Goal:** Empower creators with core automated audio analysis (master beat detection, basic stem isolation, master/stem transient detection) and a flexible marker system to precisely identify and utilize key audio events.

**User Stories:**
- **Story 2.1:** As a Creator, I want the system to automatically detect and display beat markers on my master audio track's waveform so that I have a rhythmic guide for editing.  
  **ACs:** Beat detection process can be initiated. Detected beats are visually represented on the timeline.
- **Story 2.2:** As a Creator, I want to isolate at least two key stems (e.g., vocals, drums) from my master audio track so I can analyze their specific rhythmic or dynamic content.  
  **ACs:** Stem isolation process for vocals and drums can be initiated. Isolated stems are available for further analysis/soloing.
- **Story 2.3:** As a Creator, I want to solo an isolated stem (e.g., vocals) and have the system detect and display its specific transients or amplitude ramps as markers so I can use these nuanced events for synchronization.  
  **ACs:** A stem can be soloed. Transient/ramp detection can be run on the soloed stem. Resulting markers are displayed distinctively.
- **Story 2.4:** As a Creator, I want the system to detect and display transient markers on the master audio track so I can identify sharp percussive or impactful sounds.  
  **ACs:** Transient detection process can be initiated for the master track. Detected transients are visually represented.
- **Story 2.5:** As a Creator, I want to manually add, move, and delete custom markers on the audio timeline so I can pinpoint specific moments important to my edit.  
  **ACs:** Markers can be added at any point. Markers can be dragged. Markers can be deleted.
- **Story 2.6 (Optional MVP):** As a Creator, I want to see a basic transcription of my audio's lyrical content displayed alongside the timeline so I can reference it.  
  **ACs:** Transcription process can be initiated. Timed text is displayed.

### Epic 3: Real-Time Master Audio Manipulation

**Goal:** Provide creators with fluid, real-time control over the master audio's tempo and pitch, with all visual timeline elements and markers dynamically adapting to these changes.

**User Stories:**
- **Story 3.1:** As a Creator, I want to adjust the overall tempo (BPM) of my master audio track in real-time so that I can change the song's speed without leaving the editor.  
  **ACs:** Tempo control is available. Changes are applied in real-time during playback (or with minimal processing delay).
- **Story 3.2:** As a Creator, I want all existing beat markers, transient markers, and user-defined markers on the timeline to dynamically rescale and maintain their relative positions when I change the master audio tempo.  
  **ACs:** All marker types adjust their absolute time positions correctly when tempo changes. Visual representation of timeline scales accordingly.
- **Story 3.3:** As a Creator, I want to adjust the overall pitch (key) of my master audio track in real-time so that I can change the song's key.  
  **ACs:** Pitch control is available. Changes are applied in real-time during playback (or with minimal processing delay) without significantly affecting tempo.

### Epic 4: Dynamic Marker-Driven Video Editing & Effects

**Goal:** Enable creators to intuitively sequence video clips and dynamically control video playback (switching, speed ramps) and visual effects based on user-selected audio markers and characteristics from different audio sections.

**User Stories:**
- **Story 4.1:** As a Creator, I want to arrange multiple video clips in a sequence on a conceptual video track aligned with the master audio timeline so that I can define the order of my visual content.  
  **ACs:** Multiple video clips can be added to a sequence. Order can be rearranged.
- **Story 4.2:** As a Creator, I want to define distinct sections within my audio track (e.g., "verse 1," "chorus 1," "instrumental break") so I can apply different synchronization logic to each section.  
  **ACs:** User can create named regions/sections on the audio timeline.
- **Story 4.3:** As a Creator, for each defined audio section, I want to select which set of audio markers (e.g., master beats, soloed vocal transients, drum transients, general BPM) will actively drive the video editing decisions for that section.  
  **ACs:** UI allows selection of an active marker source per audio section.
- **Story 4.4:** As a Creator, I want the system to automatically switch between video clips in my sequence based on the rules and active audio markers I've set for the current audio section (e.g., "switch on every 4th master beat," "switch on every vocal transient").  
  **ACs:** Video switches occur at the correct marker points during playback.
- **Story 4.5:** As a Creator, I want to dynamically control the playback speed of my video clips (e.g., create speed ramps) based on characteristics derived from a selected audio source (like vocal amplitude ramps from a soloed stem) for the current audio section.  
  **ACs:** Video playback speed changes visibly in sync with the chosen audio characteristic.
- **Story 4.6:** As a Creator, I want to apply at least one basic real-time visual effect (e.g., a color filter) to my video, and have its intensity or parameters be modulated by the selected active audio markers or characteristics for the current audio section.  
  **ACs:** Chosen effect is visible. Effect parameters change in response to the selected audio driver.

### Epic 5: Basic Project Export

**Goal:** Allow creators to export a watermarked preview of their synchronized audio-visual work from the client-side.

**User Stories:**
- **Story 5.1:** As a Creator, I want to initiate an export process for my current audio-visual sequence so that I can share a preview.  
  **ACs:** Export option is available. User can trigger export.
- **Story 5.2:** As a Creator, I want the exported video to include the synchronized audio, all applied video edits (cuts, speed ramps), and basic visual effects, with a visible watermark.  
  **ACs:** Exported file contains correct A/V content. Watermark is present.
- **Story 5.3:** As a Creator, I want the export to be processed client-side and be available as a downloadable file in a common web format (e.g., MP4).  
  **ACs:** Export completes in the browser. File can be downloaded.

## 7. Key Reference Documents

- **Project Brief:** Artivus Engine (The document you provided to me, John, the PM).

## 8. Out of Scope Ideas Post MVP

- **Enhanced Audio Intelligence:** Full song structure analysis (intro, verse, etc.); advanced multi-stem analysis beyond MVP stems; transcription-linked phrase markers.
- **Next-Generation Video Engine & Effects:** Transition to WebGPU; expanded visual effects library; deeper AI video generation/interpolation.
- **Advanced Export & Backend Capabilities:** High-quality server-side rendering; offloading of extremely heavy analysis tasks to backend.
- **Refined User Interface & Experience:** More detailed analysis panels and effect controls.
- **Enhanced Synchronization & Control Logic:** More sophisticated AI for A/V movement matching and user-defined rules.

## 9. [OPTIONAL: For Simplified PM-to-Development Workflow Only] Core Technical Decisions & Application Structure

Not applicable for the chosen "Outcome Focused" workflow.