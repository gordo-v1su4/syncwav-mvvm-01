## Project Brief: Artivus Engine

### 1. Introduction / Problem Statement

Artivus Engine is a paradigm-shifting, browser-based audio-visual creation suite designed to intuitively edit video clips in deep synchronization with music. It aims to solve the challenge of intricate and time-consuming audio-visual synchronization by offering AI-assisted tools that match video movements (subject and camera) with nuanced audio elements (beats, melodies, vocals, stems). The core problem it addresses is the difficulty creators face in achieving a professional, dynamic, and musically-attuned edit, particularly for music videos and dance choreography, without extensive manual effort or requiring multiple complex software tools. It empowers creators by making the 'first edit' dramatically easier and faster, potentially enabling a 'one-shot' creation experience where edits can be made to taste, on the fly.

### 2. Vision & Goals

**Vision:** The vision for 'Artivus Engine' is to be a paradigm-shifting, browser-based audio-visual creation suite. It aims to offer an unparalleled real-time, AI-assisted editing experience by combining a highly reactive Svelte UI with cutting-edge, low-latency audio and video processing. This includes deep audio intelligence (transcription, multi-layered structural and rhythmic analysis, stem separation, real-time pitch/tempo manipulation) and GPU-accelerated visual effects, enabling video cuts and effects to be intricately and intuitively synchronized to nuanced musical elements, revolutionizing how creators, especially in the music video domain, bring their audio-visual ideas to life.

**Primary Goals (for the MVP):**

*   Develop Core A/V Sync Engine: Implement the foundational capability to synchronize video clip playback (including basic cuts) to primary audio track markers (e.g., beats, user-defined points) in real-time within the Svelte frontend, leveraging WebCodecs and suitable audio timeline libraries.
*   Enable Advanced Audio Intelligence & Manipulation (MVP Core): Integrate key audio analysis features including automated beat detection, client-side stem isolation (e.g., vocals, drums), transient detection on master/stems, visualization of these as distinct markers, and derivation of dynamic control signals from vocal characteristics. Allow users to select active marker sets and manually manage markers.
*   Implement Real-Time Master Audio Manipulation: Allow real-time master audio pitch/tempo adjustments with dynamic timeline and marker rescaling.
*   Facilitate Dynamic Marker-Driven Video Editing: Enable users to arrange video sequences, define audio sections, and select which audio markers/characteristics (from master or stems) drive video clip switching and dynamic playback speed (e.g., speed ramps) for different sections.
*   Deliver Essential Real-Time Video Effects: Establish a WebGL2 rendering pipeline for video playback and allow application and audio-driven modulation of a curated selection (1-2) of shader-based visual effects.

**Success Metrics (Initial Ideas):**

*   Task Completion Time: Average time taken by a target user to produce a synchronized 1-minute video sequence.
*   User Satisfaction Score: Based on surveys focusing on intuitiveness, quality of synchronization, and overall experience (target 4/5 stars).
*   Core Feature Adoption: Percentage of users utilizing advanced audio analysis (stems, transients) and dynamic video manipulation features.
*   Performance Benchmark: Maintain a specific latency target (e.g., under X ms) for real-time audio adjustments and video effect rendering.

### 3. Target Audience / Users

The primary target audience for 'Artivus Engine' consists of music video creators, independent artists, dancers, choreographers, and producers of short-form, musically-driven commercial content. These users seek to produce visually dynamic and musically synchronized video content. They often work with pre-recorded music and aim to align video clips, effects, and transitions precisely with specific musical elements like beats, vocals, instrumental phrases, or structural sections of a song. They may range from professionals looking for a more intuitive and rapid 'first-pass' editing tool to enthusiasts and artists who want to create compelling visuals for their music or brand without the steep learning curve or time investment typically associated with traditional, complex video editing software. A key characteristic is their desire for tools that understand musicality and can automate or semi-automate the intricate task of A/V synchronization, especially for content involving dance, movement, or rapid, impactful edits that need to feel tightly coupled with the audio.

### 4. Key Features / Scope (High-Level Ideas for MVP)

*   **Core Media Ingest & Synchronized Playback:**
    *   Ability to upload primary audio tracks and multiple video clips.
    *   Interactive audio waveform display with standard playback controls.
    *   Synchronized playback of a selected video clip with the master audio track.
*   **Advanced Audio Analysis & Interactive Marker System (MVP Core):**
    *   Automated beat detection on the master audio track, visualized as primary beat markers.
    *   Client-side stem isolation for at least two key stems (e.g., vocals and drums).
    *   Ability to solo an isolated stem and generate/visualize its specific markers (e.g., transients, amplitude ramps).
    *   Automated transient detection on master track AND selected isolated stems, visualized as distinct marker types.
    *   Users can layer or switch between different sets of active markers for influencing video.
    *   Manual creation, adjustment, and deletion of user-defined markers.
    *   (Optional MVP: Basic audio transcription display).
*   **Real-Time Master Audio Manipulation (MVP Core):**
    *   Real-time master audio tempo adjustment, with timeline and all markers dynamically rescaling.
    *   Real-time master audio pitch shifting.
*   **Dynamic Marker-Driven Video Editing (MVP Core):**
    *   Arrange a sequence of video clips against the audio timeline.
    *   User can define audio sections and select which audio marker type/characteristic drives video dynamics (clip switching, speed ramps) for each section.
    *   Automated video clip switching based on selected active audio markers.
    *   Dynamic video playback speed control based on selected audio characteristics.
*   **Essential Real-Time Video Effects (MVP Selection):**
    *   Video rendering via WebGL2.
    *   Small selection (1-2) of real-time, shader-based visual effects with parameters modulatable by selected audio markers/characteristics.
*   **Basic Project Export:**
    *   Client-side export of a watermarked preview video.

### 5. Post MVP Features / Scope and Ideas

*   Enhanced Audio Intelligence: Full song structure analysis (intro, verse, etc.); advanced multi-stem analysis beyond initial MVP stems; transcription-linked phrase markers.
*   Next-Generation Video Engine & Effects: Transition to WebGPU; expanded visual effects library; deeper AI video generation/interpolation.
*   Advanced Export & Backend Capabilities: High-quality server-side rendering; offloading of extremely heavy analysis tasks to backend.
*   Refined User Interface & Experience: More detailed analysis panels and effect controls.
*   Enhanced Synchronization & Control Logic: More sophisticated AI for A/V movement matching and user-defined rules.

### 6. Known Technical Constraints or Preferences

**A. Constraints:** No major external constraints (budget, deadlines) identified at this initial stage.

**B. Initial Architectural Preferences:**

*   Strong preference for a Rust-based core for performance-critical elements.
*   Main application UI with Svelte and Vite.
*   Media processing leveraging WebGL, WebGL2, WebGPU, and WebCodecs.
*   Openness to new/cutting-edge libraries.
*   For the audio waveform display, timeline interaction, and sequencing: an openness to explore robust solutions (JavaScript or Rust-based, e.g., xmodits-like capabilities) that offer comprehensive "DAW-level" features, rather than being strictly tied to a specific library like Wavesurfer.js if better alternatives for these advanced needs exist.
*   A general interest was expressed in Rust UI libraries (e.g., egui, iced.rs), potentially for deeply integrated Rust components or future exploration.

**C. Risks:**

*   Extreme Complexity.
*   Performance Engineering (low latency for audio DSP, video, analysis).
*   Synchronization Precision (A/V sync with dynamic changes).
*   UI/UX Design (intuitive yet powerful).
*   WASM Overhead & Bundle Size.
*   Browser API Maturity & Consistency (WebGPU, WebCodecs).
*   Resource Management (memory).
*   Development Time & Expertise required.

**Mitigation Note:** A key strategy to address technical risks will be to research and adopt proven patterns from successful existing online DAWs and advanced web applications.

**D. Other User Preferences:** No specific additional preferences noted at this time.

### 7. Relevant Research (Planned)

To ensure "Artivus Engine" leverages the best approaches and learns from existing successes and challenges, the following research activities are planned:

*   Comparative Analysis of Online DAWs: Investigate existing successful online Digital Audio Workstations and similar web-based creative tools to identify proven architectural patterns, performance optimization techniques, efficient loading strategies, and solutions for seamless user experience.
*   Deep Dive into Advanced Web Video Technologies: Conduct thorough research and prototyping on optimal implementation strategies for WebCodecs, WebGL2/WebGPU for real-time effects, advanced A/V synchronization techniques, and AI video generation/interpolation methods.
*   Investigation into Audio-Visual Feature Matching: Researching how abstract audio features (envelopes, dynamic curves, unique marker identifiers from audio) can be algorithmically correlated with computer vision-detected movement in video to achieve highly nuanced and intelligent A/V synchronization.

### 8. PM Prompt

This Project Brief provides the full context for "Artivus Engine". Please start in 'PRD Generation Mode', review this brief thoroughly to work with the user to create the Product Requirements Document (PRD) section by section, one at a time. Ask for any necessary clarifications and suggest improvements as your programming allows, ensuring a detailed and actionable PRD is developed.

