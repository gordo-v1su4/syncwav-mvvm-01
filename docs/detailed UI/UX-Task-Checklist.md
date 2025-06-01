Okay, this is a highly detailed UI/UX task checklist, zeroing in on the visual and interactive elements inspired by the Wavtool UI and guided by your Artivus Engine UI/UX specification. This is tailored for a Senior UI/UX developer to guide design and for an AI Coding Agent to implement the Svelte components.

**Checklist Conventions:**

*   Tasks are grouped by major UI views/components as outlined in the `ui-ux-specification-AEMVVM.md`.
*   Each `- [ ]` represents a granular UI/UX design and Svelte implementation task.
*   "Wavtool-inspired" implies referencing the provided video for visual cues regarding dark themes, panel layouts, control styles, and color accents, adapted to Artivus Engine's specific branding ("rust-peaks," neon highlights, avoiding slate blue).
*   "Neon accent" refers to the bright accent neon colors for highlights mentioned in the UI/UX spec.
*   "Rust-peaks aesthetic" implies a clean, professional, modern dark theme, possibly with subtle textures or sharp lines if interpreted from the name, avoiding overly skeuomorphic designs unless fitting for specific controls.

---

# Artivus Engine - Detailed UI/UX Task Checklist (Senior UI/UX Developer & AI Coder Focus)

## I. Global Styles, App Shell & Core Navigation

### A. Foundational Styling & Theming (Global CSS / Svelte `app.html` & `+layout.svelte`)
*   `- [ ] Define and implement global CSS variables for the primary color palette:
    *   `- [ ] Base dark background color(s) (Wavtool-inspired, very dark gray/near black, avoiding slate blue).`
    *   `- [ ] Slightly lighter dark shades for panel backgrounds or elevated surfaces.`
    *   `- [ ] Primary text color (light gray/off-white for readability on dark backgrounds).`
    *   `- [ ] Secondary text color (dimmer light gray).`
    *   `- [ ] Defined bright neon accent color #1 (e.g., for active states, important markers, highlights).`
    *   `- [ ] Defined bright neon accent color #2 (e.g., for secondary highlights or different types of interactive elements).`
    *   `- [ ] Error/warning state color (e.g., a desaturated red or orange compatible with dark theme).`
    *   `- [ ] Success state color (e.g., a desaturated green compatible with dark theme).`
*   `- [ ] Apply global dark mode theme to the `<body>` and default HTML elements.`
*   `- [ ] Define global typography: Select and apply a clean, professional sans-serif font family suitable for UI (ensure legibility).`
*   `- [ ] Style global scrollbars (if custom styling is desired) to match the dark theme (thin, unobtrusive, possibly with neon accent on hover).`
*   `- [ ] Implement basic CSS reset or normalize.css to ensure consistent baseline styling across browsers.`
*   `- [ ] Create global utility CSS classes for common patterns (e.g., `neon-text-accent-1`, `dark-panel-bg`, `flex-center`, etc.).`
*   `- [ ] Ensure all global color combinations (text on background, accents) meet WCAG AA contrast ratios.`

### B. Main Application Shell (`App.svelte` or Root Layout Component)
*   `- [ ] Create the main application shell Svelte component (`App.svelte` or `+layout.svelte`).`
*   `- [ ] Implement the overall page structure: Header (if any for global nav), Main Content Area.`
*   `- [ ] Ensure the shell fills the viewport and uses the global dark theme background.`

### C. Global Header / Persistent Navigation (Conceptual: `GlobalHeader.svelte`)
*   `- [ ] Design and implement a `GlobalHeader.svelte` component if project navigation (App Entry/Hub, Settings) is to be persistent at the top (Wavtool has a top menu bar).`
*   `- [ ] Style `GlobalHeader.svelte`: Dark background, Artivus Engine logo/name (placeholder initially).`
*   `- [ ] Add navigation links/buttons for "App Entry / Project Hub" and "Application Settings."`
*   `- [ ] Style navigation links: Clear text, appropriate hover/active states using neon accents.`
*   `- [ ] Ensure `GlobalHeader.svelte` links are keyboard navigable and operable.`

### D. Primary Mode Tab/View Switcher (Conceptual: `ModeSwitcher.svelte`)
*   `- [ ] Design and implement `ModeSwitcher.svelte` component.`
*   `- [ ] Layout: Horizontal tab bar, prominently placed (e.g., below Global Header or as primary navigation if no Global Header).`
*   `- [ ] Tabs: "[SETUP]", "[EDIT]", "[EXPORT]".`
*   `- [ ] Styling:
    *   `- [ ] Tab background: Dark, matching panel styles.`
    *   `- [ ] Tab text: Clear, readable.`
    *   `- [ ] Active tab indication: Use neon accent color #1 for border, background, or text color to clearly distinguish the active mode.`
    *   `- [ ] Hover state for tabs: Subtle background change or neon accent highlight.`
    *   `- [ ] "Fun and fluid" transitions between tab views (e.g., subtle fade or quick slide if not performance-prohibitive for MVP).`
*   `- [ ] Implement Svelte store (`uiStore.js` or similar) to manage `currentAppMode` state.`
*   `- [ ] Connect `ModeSwitcher.svelte` to update `currentAppMode` in the store on tab click.`
*   `- [ ] The root layout component should conditionally render the correct View component based on `currentAppMode`.`
*   `- [ ] Ensure tabs are keyboard navigable (arrow keys to switch, Enter/Space to select).`

## II. Application Views / Modes

### A. [SETUP] Mode: `ProjectMediaManagementView.svelte`
*   `- [ ] Design the layout for `ProjectMediaManagementView.svelte`: Focus on clarity for media upload and project asset overview.`
*   `- [ ] **Media Upload Area:**
    *   `- [ ] Create a distinct visual zone for uploading files.`
    *   `- [ ] Implement a styled "Upload Master Audio" button/dropzone.
        *   `- [ ] Clear iconography (e.g., music note, upload icon).`
        *   `- [ ] Text: "Upload Master Audio (MP3, WAV)".`
        *   `- [ ] Styling: Dark button, neon accent on hover.`
    *   `- [ ] Implement a styled "Upload Video Clips (MP4)" button/dropzone.
        *   `- [ ] Clear iconography (e.g., video camera, upload icon).`
        *   `- [ ] Text: "Upload Video Clips (MP4)".`
        *   `- [ ] Styling: Similar to audio upload button.`
    *   `- [ ] Implement progress bar display for file uploads:
        *   `- [ ] Individual progress bar for each active upload.`
        *   `- [ ] Style: Thin progress bar, neon accent color for fill, percentage text.`
*   `- [ ] **Project Asset Library (Preview in SETUP mode):**
    *   `- [ ] Placeholder area or simplified view of the `AssetLibrary.svelte` component (detailed later for [EDIT] mode) showing uploaded assets.`
    *   `- [ ] Text indication: "Uploaded audio/video will appear here and in the EDIT mode Asset Library."`
*   `- [ ] Apply consistent dark theme styling, professional feel.`
*   `- [ ] Ensure interactive elements are keyboard accessible.`

### B. [EDIT] Mode: `MainEditingInterfaceView.svelte` (Most Complex View)
*   `- [ ] Design the multi-panel layout for `MainEditingInterfaceView.svelte` based on UI/UX spec conceptual layout:
    *   `- [ ] Top: Master Waveform Display Row.`
    *   `- [ ] Top-Center (below Waveform): Video Preview Area.`
    *   `- [ ] Left: Collapsible Project Asset Library Panel.`
    *   `- [ ] Right: Collapsible Contextual Controls Panel.`
    *   `- [ ] Bottom: Main Interactive Video Timeline.`
    *   `- [ ] Integrated Master Playback Controls.`
*   `- [ ] Implement panel collapsibility for Left and Right side panels:
    *   `- [ ] Clear icons/buttons to toggle collapse/expand state (e.g., arrows).`
    *   `- [ ] Smooth animation for collapse/expand.`
    *   `- [ ] Store panel states (collapsed/expanded) in `uiStore.js`.`

    **B.1. Top Prominent Waveform Display Row (`WaveformDisplay.svelte`)**
    *   `- [ ] Design and implement `WaveformDisplay.svelte` component.`
    *   `- [ ] Use HTML Canvas for rendering the master audio waveform.`
    *   `- [ ] Styling:
        *   `- [ ] Background: Very dark, matching global theme.`
        *   `- [ ] Waveform color: Bright neon accent color #1 or a dedicated clear color (e.g., light gray, white).`
        *   `- [ ] Amplitude representation: Clear peak visualization.`
    *   `- [ ] Implement visual playhead: Thin vertical line, contrasting color (e.g., neon accent #2 or white).`
    *   `- [ ] Implement rendering for various marker types (ensure visual distinction):
        *   `- [ ] Master Beat Markers: Vertical lines, specific neon color (e.g., Neon Accent #1), subtle pulse animation on current beat (optional).`
        *   `- [ ] Master Transient Markers: Different color or shape (e.g., small diamonds, Neon Accent #2).`
        *   `- [ ] Stem-Specific Markers (e.g., Vocal Transients): Yet another distinct color/style when active.`
        *   `- [ ] Custom User Markers: Distinct color/style, possibly with a small handle.`
    *   `- [ ] Implement rendering for Audio Sections:
        *   `- [ ] Visually delineate sections (e.g., translucent colored overlays on the waveform, or distinct background color for section regions on a separate ruler above/below waveform).`
        *   `- [ ] Display section names within their visual representation or on hover.`
        *   `- [ ] Handles for dragging section start/end times, clearly visible and grabbable.`
    *   `- [ ] Implement zoom controls (e.g., `+`/`-` buttons, scroll wheel zoom):
        *   `- [ ] Buttons styled consistently with other UI controls.`
        *   `- [ ] Smooth visual scaling of the waveform and markers on zoom.`
    *   `- [ ] Implement pan/scroll functionality for the waveform when zoomed.`
    *   `- [ ] Time ruler above or below the waveform: Clear tick marks for seconds/bars-beats (if BPM known). Readable time labels.`
    *   `- [ ] Interaction: Click-to-seek playhead position.` Alt/Cmd+click to add custom marker.`
    *   `- [ ] Accessibility: Ensure marker information can be conveyed to assistive tech (e.g., on focus/selection).`

    **B.2. Top-Center Video Preview Area (`VideoPreview.svelte`)**
    *   `- [ ] Design and implement `VideoPreview.svelte` component.`
    *   `- [ ] Prominent placement, likely a fixed aspect ratio (e.g., 16:9).`
    *   `- [ ] Contains the WebGL2 `<canvas>` for video rendering.`
    *   `- [ ] Simple border or subtle inset to define its area.`
    *   `- [ ] (Future consideration for UI) Placeholder text/icon when no video is loaded/playing.`

    **B.3. Left Side Panel (Collapsible): `AssetLibrary.svelte`**
    *   `- [ ] Design and implement `AssetLibrary.svelte` component.`
    *   `- [ ] Styling: Dark panel background.`
    *   `- [ ] List view for uploaded video assets:
        *   `- [ ] Each item: Video thumbnail (client-generated), video filename.`
        *   `- [ ] Style list items: Clear text, subtle hover state.`
        *   `- [ ] Selected state for an asset (e.g., when dragged or properties viewed): Neon accent border or background highlight.`
    *   `- [ ] Make items draggable to the `VideoTimeline.svelte`.`
    *   `- [ ] Vertical scrollbar if content overflows, styled to match theme.`
    *   `- [ ] (Optional MVP) Basic filtering or search input at the top of the library.`

    **B.4. Right Side Panel (Collapsible): Contextual Controls (Master Container with Tabs/Sections)**
    *   `- [ ] Design and implement a master `ContextualControlsPanel.svelte` component.`
    *   `- [ ] Implement a tabbed or accordion-style interface within this panel to switch between different control sets (Audio Analysis, Marker Tools, Synchronization Rules, Effects Parameters, Stem Controls).
        *   `- [ ] Tab/Accordion Header Styling: Clear labels, neon accent for active/selected tab/section.`
    *   `- [ ] **`AudioAnalysisControls.svelte` (Section/Tab):**
        *   `- [ ] Buttons for "Detect Master Beats," "Isolate Vocals & Drums," "Detect Master Transients."`
        *   `- [ ] Style buttons: Consistent dark theme, clear text/icons, neon accent on hover.`
        *   `- [ ] Loading indicator (e.g., spinner icon + "Analyzing...") next to buttons when active.`
    *   `- [ ] **`StemControls.svelte` (Section/Tab):**
        *   `- [ ] Dynamically display controls for available stems (e.g., "Vocals," "Drums").`
        *   `- [ ] For each stem: "Solo" button (toggle state, neon accent when active), "Detect Transients" button.`
        *   `- [ ] Clear visual indication of which stem is soloed.`
    *   `- [ ] **`ManualMarkerTools.svelte` (Section/Tab):**
        *   `- [ ] "Add Marker at Playhead" button.`
        *   `- [ ] UI for selecting a marker (sync with waveform selection).`
        *   `- [ ] "Delete Selected Marker" button (enabled when a marker is selected).`
        *   `- [ ] (Optional MVP) Input field for naming/editing selected marker's label.`
    *   `- [ ] **`SectionSyncRules.svelte` (Section/Tab for Synchronization Rules - see PRD Story 4.3, 4.4, 4.5):**
        *   `- [ ] UI to select active audio section (links to selection on `WaveformDisplay.svelte`).`
        *   `- [ ] Dropdown: "Driving Audio Feature" (Master Beats, Vocal Transients, etc.). Style dropdowns consistently (dark, neon accents).`
        *   `- [ ] Input for "Switch on every Nth marker event" (styled number input).`
        *   `- [ ] "Condition Sliders" (as per UI/UX spec, PRD Epic 4) - conceptual for now, needs detailed design:
            *   `- [ ] May involve selecting audio characteristic (e.g., "Vocal Amplitude").`
            *   `- [ ] Sliders for "Min Speed," "Max Speed."`
            *   `- [ ] Toggle/Checkbox for "Invert" mapping.`
            *   `- [ ] All sliders/inputs styled for dark theme, clear value display, neon accents for handles/active states.`
    *   `- [ ] **`SectionEffectRules.svelte` (Section/Tab for Effects Parameters - see PRD Story 4.6):**
        *   `- [ ] Dropdown to select 1-2 basic visual effects.`
        *   `- [ ] UI to select audio driver for effect modulation (similar to sync rules).`
        *   `- [ ] Sliders/inputs for effect-specific parameters (e.g., "Strength," "Attack," "Decay," "Min/Max Value"). Styled consistently.`
    *   `- [ ] Ensure all controls are keyboard accessible and provide clear visual feedback.`

    **B.5. Bottom Main Interactive Timeline (`VideoTimeline.svelte`)**
    *   `- [ ] Design and implement `VideoTimeline.svelte` component.`
    *   `- [ ] Align time axis precisely with `WaveformDisplay.svelte` (responds to master zoom/pan/tempo changes).`
    *   `- [ ] Represent video sequence "rows" (single row for MVP).`
    *   `- [ ] Render video clip instances as blocks:
        *   `- [ ] Show a snippet of the video thumbnail or a solid color block with clip name.`
        *   `- [ ] Block length visually represents clip duration on the timeline.`
        *   `- [ ] Selected clip instance: Neon accent border.`
        *   `- [ ] Currently playing clip instance (if different from selected): Different neon accent outline (as per UI/UX spec).`
    *   `- [ ] Implement drag-to-reorder clips within the sequence.`
    *   `- [ ] Implement drag-to-trim clip start/end edges (visual handles appear on hover/selection).`
    *   `- [ ] Keyboard interaction: Select clips (arrow keys if focus is on timeline), Delete selected clip.`
    *   `- [ ] Context menu on clip (right-click): "Delete," "Properties" (future). Styled for dark theme.`

    **B.6. Master Playback Controls (`PlaybackControls.svelte`)**
    *   `- [ ] Design and implement `PlaybackControls.svelte` component.`
    *   `- [ ] Logical placement (e.g., integrated with Bottom Timeline or below Video Preview).`
    *   `- [ ] Buttons: Play, Pause, Stop. (Wavtool has these typically at the bottom center).
        *   `- [ ] Clear iconography (standard play/pause/stop symbols).`
        *   `- [ ] Styling: Dark buttons, neon accent on hover/active state. Play button icon should change to Pause icon when playing.`
    *   `- [ ] (Optional MVP) Loop toggle button.`
    *   `- [ ] (Optional MVP) Time display (current time / total duration), though this might be part of waveform/timeline rulers.`
    *   `- [ ] Ensure controls are keyboard accessible (e.g., Spacebar for Play/Pause).`

### C. [EXPORT] Mode: `ExportView.svelte`
*   `- [ ] Design and implement `ExportView.svelte`. Focus on simplicity for MVP.`
*   `- [ ] Styling: Consistent dark theme.`
*   `- [ ] "Start Export" button: Prominently styled.`
*   `- [ ] Progress display area:
    *   `- [ ] Text status: "Preparing...", "Rendering frame X of Y...", "Encoding audio...", "Finalizing..."`
    *   `- [ ] Overall progress bar: Styled consistently (neon accent fill).`
*   `- [ ] Input field for filename (optional, default to "artivus-export.mp4"). Styled input.`
*   `- [ ] On completion: "Export Complete! Download" link/button.`
*   `- [ ] Error display area for export failures.`

### D. `AppEntryHubView.svelte`
*   `- [ ] Design and implement `AppEntryHubView.svelte`.`
*   `- [ ] Simple, welcoming screen.`
*   `- [ ] "Create New Project" button: Large, clear, inviting call to action. Styled with neon accent.`
*   `- [ ] (Future) List of recent projects.`
*   `- [ ] Consistent dark theme and branding elements.`

### E. `ApplicationSettingsView.svelte` (Minimal MVP)
*   `- [ ] Design and implement `ApplicationSettingsView.svelte`.`
*   `- [ ] Basic placeholder for MVP: "Application Settings (Coming Soon)".`
*   `- [ ] (Future) Options for theme customization, performance settings, default paths etc.`
*   `- [ ] Consistent dark theme.`

## III. General UI Components & UX Patterns

### A. Modals / Dialogs
*   `- [ ] Design a standard modal/dialog component for confirmations, errors, or settings.`
*   `- [ ] Styling: Dark background overlay, modal panel with dark background, clear title, content area, action buttons (e.g., "OK," "Cancel," "Save"). Buttons styled with neon accents for primary actions.`
*   `- [ ] Ensure modals are keyboard accessible (focus trapping, Esc to close).`

### B. Tooltips
*   `- [ ] Design a standard tooltip component for clarifying icons or controls on hover.`
*   `- [ ] Styling: Small, dark background, light text, subtle appearance animation.`

### C. Loading Indicators
*   `- [ ] Design standard loading indicators:
    *   `- [ ] Small spinner for inline loading (e.g., next to a button). Neon accent color.`
    *   `- [ ] Full-screen overlay loader for blocking operations (e.g., initial project load if heavy). Translucent dark overlay with a larger spinner/message.`

### D. Error Handling Display
*   `- [ ] Design a consistent way to display errors:
    *   `- [ ] Inline error messages below form fields (e.g., red neon text).`
    *   `- [ ] Global toast notifications for non-blocking errors/success messages (top or bottom of screen, dark background, appropriate icon and neon accent for error/success).`

### E. Accessibility (AX) - General Pass
*   `- [ ] For every interactive component created (buttons, sliders, inputs, tabs, custom controls):
    *   `- [ ] Ensure it is fully keyboard navigable and operable.`
    *   `- [ ] Provide clear visual focus states (e.g., neon accent outline or distinct background change).`
    *   `- [ ] Add appropriate ARIA attributes if native HTML elements are not used or if semantics need enhancement (e.g., `aria-label`, `role`, `aria-valuenow` for sliders).`
*   `- [ ] Review all text and UI element color combinations against WCAG AA contrast requirements again after implementation.`

### F. Responsiveness & Cross-Browser (Desktop MVP)
*   `- [ ] Ensure the overall layout and key components adapt gracefully to common desktop screen resolutions (e.g., 1280px width up to 1920px+). Primarily flexbox/grid layouts for fluidity.`
*   `- [ ] Display a "Best viewed on desktop" message for tablet/mobile screen sizes (media query based).`
*   `- [ ] Perform basic visual checks on latest Chrome, Firefox, Edge, Safari (desktop) towards the end of UI development for major layout/styling issues.`

---

This checklist should provide a solid foundation for both the UI/UX design refinement and the Svelte implementation, keeping the Wavtool inspiration and Artivus Engine's specific requirements in mind.