# Artivus Engine - Detailed UI/UX Task Checklist (Refined)

## I. Global Styles, App Shell & Core Navigation

### A. Foundational Styling & Theming (Global CSS / Svelte `app.html` & `+layout.svelte`)
*   `- [ ] Define and implement global CSS variables for the primary color palette:
    *   `- [ ] Base dark background color(s) (Wavtool-inspired, very dark gray/near black, avoiding slate blue, e.g., `#1A1A1A` to `#202020`).`
    *   `- [ ] Slightly lighter dark shades for panel backgrounds or elevated surfaces (e.g., `#282828` to `#303030`).`
    *   `- [ ] Primary text color (light gray/off-white for readability, e.g., `#E0E0E0`).`
    *   `- [ ] Secondary text color (dimmer light gray, e.g., `#A0A0A0`).`
    *   `- [ ] Defined bright neon accent color #1 (e.g., vibrant cyan, electric blue, or "rust-peaks" orange/amber for active states, important markers, highlights – *Final color to be from branding*).`
    *   `- [ ] Defined bright neon accent color #2 (a complementary neon for secondary highlights or different interactive elements – *Final color to be from branding*).`
    *   `- [ ] Error/warning state color (e.g., a desaturated red/orange compatible with dark theme, e.g., `#FF6B6B`).`
    *   `- [ ] Success state color (e.g., a desaturated green compatible with dark theme, e.g., `#51CF66`).`
*   `- [ ] Apply global dark mode theme to the `<body>` and default HTML elements. Ensure `background-color` is set on `html` and `body`.`
*   `- [ ] Define global typography: Select and apply a clean, professional sans-serif font family (e.g., Inter, Roboto, Open Sans) suitable for UI. Ensure sufficient font weights are available.`
*   `- [ ] Style global scrollbars (if custom styling is desired) to match the dark theme (thin, unobtrusive, possibly with neon accent on hover for the thumb).`
*   `- [ ] Implement basic CSS reset or normalize.css.`
*   `- [ ] Create global utility CSS classes (e.g., `neon-text-accent-1`, `dark-panel-bg`, `flex-center`, `button-primary`, `button-secondary`).`
*   `- [ ] Ensure all global color combinations meet WCAG AA contrast ratios (text on background, accents on their respective backgrounds).`

### B. Main Application Shell (`App.svelte` or Root Layout Component)
*   `- [ ] Create the main application shell Svelte component (`App.svelte` or `+layout.svelte`).`
*   `- [ ] Implement the overall page structure: Top Bar (for mode switcher & global actions), Main Content Area which will dynamically change based on the selected mode.`
*   `- [ ] Ensure the shell fills the viewport and uses the global dark theme background.`

### C. Top Bar (Combined Mode Switcher & Global Actions) (Conceptual: `TopBar.svelte`)
*   `- [ ] Design and implement `TopBar.svelte` component. This will be a persistent bar at the top.
    *   `- [ ] **Left Side:** Artivus Engine Logo/Name (placeholder initially). (Wavtool has "WAVTOOL" text).`
    *   `- [ ] **Center:** Primary Mode Tabs: "[SETUP]", "[EDIT]", "[EXPORT]".
        *   `- [ ] Styling: Inspired by Wavtool's top tabs. Flat, integrated look.
            *   `- [ ] Tab background: Matches TopBar background.`
            *   `- [ ] Tab text: Clear, readable (primary text color).`
            *   `- [ ] Active tab indication: Bright neon accent color #1 for an underline or top border, and possibly slightly brighter text.`
            *   `- [ ] Hover state for tabs: Subtle background change or text brightness increase.`
    *   `- [ ] **Right Side:** Global action icons/buttons (e.g., "Project Hub/Home," "Settings," "User Account/Login" - MVP might only have Project Hub & Settings).
        *   `- [ ] Styled as icons with tooltips, or small text buttons, fitting the dark theme.`
*   `- [ ] Implement Svelte store (`uiStore.js`) for `currentAppMode` and connect to tabs.`
*   `- [ ] Root layout renders correct View component based on `currentAppMode`.`
*   `- [ ] Ensure tabs and global action buttons are keyboard navigable and operable.`

## II. Application Views / Modes

### A. [SETUP] Mode: `ProjectMediaManagementView.svelte`
*   `- [ ] Design layout for `ProjectMediaManagementView.svelte`: Clean, focused on media ingest.`
*   `- [ ] **Media Upload Area:**
    *   `- [ ] Centered or prominent section for file input.`
    *   `- [ ] "Upload Master Audio (MP3, WAV)" button/dropzone: Large, clear text/icon (music note + upload). Dark button, neon accent on hover. Provide visual feedback on drag-over.`
    *   `- [ ] "Upload Video Clips (MP4)" button/dropzone: Similar styling (video icon + upload).`
    *   `- [ ] Progress bar display for uploads: Style: thin bar, neon accent for fill, percentage text. Show per-file progress if multiple videos are uploaded.`
*   `- [ ] **Project Asset List (Simplified for [SETUP] mode):**
    *   `- [ ] A simple list displaying names of uploaded master audio and video clips.
    *   `- [ ] Text indication: "Media uploaded. Go to EDIT mode to start synchronizing."`
*   `- [ ] Apply consistent dark theme, professional "rust-peaks" feel.`
*   `- [ ] Ensure interactive elements are keyboard accessible.`

### B. [EDIT] Mode: `MainEditingInterfaceView.svelte` (Main Workspace)
*   `- [ ] Design the multi-panel layout inspired by DAWs like Wavtool:
    *   `- [ ] Top: Master Waveform Display Row (`WaveformDisplay.svelte`).`
    *   `- [ ] Center-Left (main area): Video Preview (`VideoPreview.svelte`) above the Video Timeline (`VideoTimeline.svelte`).`
    *   `- [ ] Left: Collapsible Project Asset Library Panel (`AssetLibrary.svelte`).`
    *   `- [ ] Right: Collapsible Audio-Driven Control Panel (`AudioDrivenControlPanel.svelte`).`
    *   `- [ ] Bottom (spanning below Video Timeline & Asset Library): Master Playback Controls (`PlaybackControls.svelte`).`
*   `- [ ] Implement panel collapsibility for Left and Right side panels: Clear icons (e.g., chevrons), smooth animation. State managed in `uiStore.js`.`

    **B.1. Top Prominent Waveform Display Row (`WaveformDisplay.svelte`)**
    *   `- [ ] (Largely as before) Design and implement `WaveformDisplay.svelte`. Canvas rendering.`
    *   `- [ ] Styling: Very dark background. Waveform color: bright neon accent or clear contrasting color (e.g., light gray).`
    *   `- [ ] Visual playhead: Thin vertical line, contrasting color (e.g., different neon accent or white).`
    *   `- [ ] Marker Rendering (Visually Distinct):
        *   `- [ ] Master Beat Markers: Neon Accent #1 vertical lines.`
        *   `- [ ] Master Transient Markers: Neon Accent #2 diamonds/dots.`
        *   `- [ ] Stem-Specific Markers: Different color (e.g., from a predefined set for stems) when visible.`
        *   `- [ ] Custom User Markers: Unique color/style, grabbable handle.`
    *   `- [ ] Audio Section Rendering:
        *   `- [ ] Translucent colored overlays on waveform, or distinct regions on a ruler. Wavtool uses colored blocks above tracks for sections; adapt this for a single master waveform.`
        *   `- [ ] Display section names. Draggable start/end handles.`
    *   `- [ ] Zoom/Pan controls (buttons `+`/`-`, scroll wheel). Smooth scaling. Time ruler.`
    *   `- [ ] Interactions: Click-to-seek. Alt/Cmd+click to add custom marker. Click to select section/marker for editing in `AudioDrivenControlPanel.svelte`.`

    **B.2. Center-Left: Video Preview Area (`VideoPreview.svelte`)**
    *   `- [ ] (As before) Implement `VideoPreview.svelte`. Prominent, fixed aspect ratio (16:9). WebGL2 `<canvas>`. Simple border.`

    **B.3. Center-Left: Main Interactive Video Timeline (`VideoTimeline.svelte`)**
    *   `- [ ] **Design inspired by Wavtool's MIDI sequencer/piano roll area.** Horizontally aligned with `WaveformDisplay.svelte`'s time axis, sharing zoom/pan context.`
    *   `- [ ] Render video clip instances as **solid blocks** on a single track (MVP).
        *   `- [ ] Block color: Default dark shade, or derived from video thumbnail (advanced).`
        *   `- [ ] Display clip name or a miniature thumbnail within the block if space allows.`
        *   `- [ ] Block length = clip duration on timeline.`
        *   `- [ ] **Selected clip instance: Bright neon accent #1 border.**`
        *   `- [ ] **Currently playing clip instance: Bright neon accent #2 thicker outline or overlay.** (As per UI/UX spec).`
    *   `- [ ] Drag & Drop from `AssetLibrary.svelte` to place clips.`
    *   `- [ ] Drag existing clips to reorder. Drag edges to trim (visual handles).`
    *   `- [ ] Keyboard: Select, Delete. Context menu (right-click) for "Delete", etc.`
    *   `- [ ] Time ruler directly above this timeline, synced with master waveform ruler.`

    **B.4. Left Side Panel (Collapsible): `AssetLibrary.svelte`**
    *   `- [ ] (Largely as before) Implement `AssetLibrary.svelte`. Dark panel.`
    *   `- [ ] List view: Video thumbnail, filename. Subtle hover. Selected state: neon highlight.`
    *   `- [ ] Items draggable to `VideoTimeline.svelte`. Styled vertical scrollbar.`
    *   `- [ ] (New) Section for "Generated Content" (Post-MVP): For AI-generated videos/transitions. Initially a placeholder: "AI Generations (Coming Soon)".`

    **B.5. Right Side Panel (Collapsible): `AudioDrivenControlPanel.svelte`**
    *   `- [ ] **Design inspired by Wavtool's "AI & Skills" / "Composer" panel.** Context-sensitive content.`
    *   `- [ ] Overall structure:
        *   `- [ ] Panel Title (e.g., "Audio-Visual Controls" or "Sync Director").`
        *   `- [ ] Main content area that changes based on selection (no selection, audio section selected, specific tool active).`
        *   `- [ ] Possibly a top-level list/menu for major functions if not purely context-driven (similar to Wavtool's "AI & Skills" list).`
    *   `- [ ] **Default/No Selection State:**
        *   `- [ ] Buttons: "Detect Master Beats," "Isolate Stems," "Detect Master Transients." (Styled like Wavtool's list items or compact buttons).`
        *   `- [ ] "Manual Marker Mode" toggle/button.`
    *   `- [ ] **When an Audio Section is Selected (on `WaveformDisplay.svelte`):**
        *   `- [ ] Display Section Name (editable input field).`
        *   `- [ ] **Synchronization Rules Sub-panel:**
            *   `- [ ] Dropdown: "Driving Audio Feature" (Master Beats, Vocal Transients, etc.). Styled like Wavtool's dropdowns if applicable (dark, clear text, neon accent for arrow).`
            *   `- [ ] For "Clip Switching": Input "Switch every Nth marker."`
            *   `- [ ] For "Speed Ramps":
                *   `- [ ] Dropdown: "Audio Characteristic Source" (e.g., Vocal Amplitude).`
                *   `- [ ] Sliders: "Min Speed," "Max Speed." (Styled sliders: dark track, neon accent thumb/fill).`
                *   `- [ ] Toggle/Checkbox: "Invert Mapping."`
        *   `- [ ] **Effect Rules Sub-panel:**
            *   `- [ ] Dropdown: "Select Visual Effect" (e.g., Color Filter).`
            *   `- [ ] Dropdown: "Modulate By" (Audio driver: Marker Pulses, Continuous Characteristic).`
            *   `- [ ] Sliders/Inputs for effect params (e.g., "Intensity," "Color Hue"). Styled consistently.`
            *   `- [ ] Sliders for modulation mapping (e.g., "Min/Max Effect Value," "Attack/Decay" for pulses).`
    *   `- [ ] **When "Manual Marker Mode" is Active / Marker Selected:**
        *   `- [ ] "Add Marker at Playhead" button.`
        *   `- [ ] "Delete Selected Marker" button.`
        *   `- [ ] Input for selected marker's name/label.`
    *   `- [ ] **Stem Controls (if stems isolated):**
        *   `- [ ] List of available stems (e.g., "Vocals," "Drums").`
        *   `- [ ] Per stem: "Solo" button (toggle, neon active), "Detect Transients on Stem" button.`
    *   `- [ ] (New - for future video generation, inspired by "Compose with AI"): Placeholder section "AI Video Tools":
        *   `- [ ] Button: "Import Additional Video Clips".`
        *   `- [ ] (Post-MVP) "Generate Transition," "Group Selected Clips."`
    *   `- [ ] All UI elements (buttons, dropdowns, sliders, inputs) must have a consistent dark theme style with neon accents. Prioritize clarity and ease of use.`

    **B.6. Bottom Bar: Master Playback Controls (`PlaybackControls.svelte`)**
    *   `- [ ] (Largely as before) Implement `PlaybackControls.svelte`.
    *   `- [ ] Placement: Bottom-center of the application window, similar to many DAWs.`
    *   `- [ ] Buttons: Play (icon changes to Pause), Stop. Clear standard icons. Dark, neon accents.`
    *   `- [ ] (Optional MVP) Loop toggle. Time display (current time / total duration).`
    *   `- [ ] Keyboard: Spacebar for Play/Pause.`

### C. [EXPORT] Mode: `ExportView.svelte`
*   `- [ ] (As before) Implement `ExportView.svelte`. Simple, dark theme.`
*   `- [ ] "Start Export" button. Progress display (text status, progress bar with neon accent).`
*   `- [ ] Optional filename input. "Export Complete! Download" link/button.`

### D. `AppEntryHubView.svelte`
*   `- [ ] (As before) Implement `AppEntryHubView.svelte`. Welcoming screen.`
*   `- [ ] "Create New Project" button (large, neon accent). (Future: recent projects). Dark theme.`

### E. `ApplicationSettingsView.svelte` (Minimal MVP)
*   `- [ ] (As before) Implement `ApplicationSettingsView.svelte`. Placeholder "Settings (Coming Soon)". Dark theme.`

## III. General UI Components & UX Patterns (Reiteration with Wavtool Influence)

### A. Modals / Dialogs
*   `- [ ] Standard modal: Dark overlay, dark panel, clear title, content, action buttons (neon for primary). Keyboard accessible.`

### B. Tooltips
*   `- [ ] Standard tooltip: Small, dark, light text, subtle animation. For icons/controls.`

### C. Loading Indicators
*   `- [ ] Small neon spinner (inline). Full-screen dark overlay loader for blocking ops.`

### D. Form Controls (Inputs, Sliders, Dropdowns)
*   `- [ ] Design consistent styling for all form controls:
    *   `- [ ] **Inputs (text, number):** Dark background, light text, neon accent border on focus.`
    *   `- [ ] **Sliders:** Dark track, neon accent thumb and active track portion.`
    *   `- [ ] **Dropdowns (`<select>` or custom):** Dark background, light text, neon accent for dropdown arrow/highlight. Options list also dark themed.`
    *   `- [ ] **Buttons:** Clear hierarchy (primary with neon fill/border, secondary with neon outline or subtle dark fill). Consistent padding and font size.`
    *   `- [ ] **Checkboxes/Toggles:** Custom styled to fit dark theme, neon accent for checked/active state.`

### E. Error Handling Display
*   `- [ ] Inline error messages (neon red/orange text). Global toast notifications (dark, appropriate icon, neon accents).`

### F. Accessibility (AX) - General Pass
*   `- [ ] (As before) Keyboard navigable, clear focus states (neon accent outline), ARIA attributes.`
*   `- [ ] Color contrast checks remain critical.`

### G. Responsiveness & Cross-Browser (Desktop MVP)
*   `- [ ] (As before) Graceful adaptation to common desktop resolutions. "Best viewed on desktop" message for smaller screens.`
*   `- [ ] Basic visual checks on latest Chrome, Firefox, Edge, Safari (desktop).`

