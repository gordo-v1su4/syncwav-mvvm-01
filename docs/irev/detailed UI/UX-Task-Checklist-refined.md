# Artivus Engine - Detailed UI/UX Task Checklist (Refined)

*Inspired by Wavtool's DAW interface patterns while maintaining Artivus Engine's unique "rust-peaks" aesthetic and audio-visual synchronization focus.*

## Project Context & Design Philosophy

**Core Aesthetic:** Professional dark theme with "rust-peaks" branding, featuring carefully calibrated neon accents that enhance usability without overwhelming the interface. The design should feel modern, powerful, and deeply connected to music production workflows.

**Technical Foundation:** SvelteKit application with custom CSS (no Tailwind), WebGL2 video rendering, Web Audio API, and Rust/WASM performance modules.

**Key Design Influences:**
- Wavtool's "AI & Skills" panel → `AudioDrivenControlPanel.svelte`
- Wavtool's MIDI sequencer/piano roll → `VideoTimeline.svelte`
- Professional DAW layouts for multi-panel workspace organization

---

## I. Global Foundation & Brand Identity

### A. Core Color System & Brand Variables (`src/app.css`)
*   `- [ ] Refine the existing CSS custom properties based on established rust-peaks identity:
    *   `- [ ] **Primary Backgrounds:** 
        *   `--bg-primary: #0a0a0a` (deepest background - main canvas)
        *   `--bg-secondary: #151515` (panel backgrounds)
        *   `--bg-tertiary: #202020` (elevated elements, cards)
        *   `--bg-elevated: #252525` (modal overlays, dropdowns)`
    *   `- [ ] **Text Hierarchy:**
        *   `--text-primary: #f0f0f0` (primary content, headings)
        *   `--text-secondary: #b0b0b0` (secondary content, labels)
        *   `--text-dimmed: #808080` (disabled, subtle text)`
    *   `- [ ] **Rust-Peaks Neon Accent System:**
        *   `--neon-accent-1: #00ff88` (primary interactions, active states, beat markers)
        *   `--neon-accent-2: #ff6b35` (secondary highlights, transient markers, "rust" element)
        *   `--neon-accent-3: #00d4ff` (tertiary accents, special markers)
        *   `--neon-accent-warm: #ffaa3d` (warm rust tone for branding elements)`
    *   `- [ ] **Semantic State Colors:**
        *   `--color-error: #ff5555` (errors, warnings)
        *   `--color-success: #55ff55` (success states, confirmations)
        *   `--color-info: #3d9eff` (information, help text)`
*   `- [ ] **Spacing & Layout System:** Enhance existing spacing variables for consistent rhythm.`
*   `- [ ] **Typography System:** Define font-weight scale (400, 500, 600, 700) and size scale optimized for interface elements.`
*   `- [ ] **Animation & Transition System:** Define performance-optimized transition durations and easing functions.`

### B. Advanced Styling Systems
*   `- [ ] **Button Component System:** Create comprehensive button variants (primary, secondary, accent, ghost, icon-only) with consistent hover/active/disabled states.`
*   `- [ ] **Form Control System:** Unified styling for inputs, selects, sliders, checkboxes, toggles with neon accent focus states.`
*   `- [ ] **Panel & Layout System:** Define elevation levels, borders, and panel spacing patterns.`
*   `- [ ] **Typography Scale:** Implement heading hierarchy and text styles for UI elements.`

### C. Application Shell Architecture (`src/routes/+layout.svelte`)
*   `- [ ] Implement SvelteKit layout structure with proper route organization:
    *   `- [ ] Main layout component handling global state and navigation
    *   `- [ ] Route-based view switching for [SETUP], [EDIT], [EXPORT] modes
    *   `- [ ] Persistent top navigation and global UI elements`
*   `- [ ] **Responsive Layout Grid:** CSS Grid or Flexbox system for the main workspace panels with proper collapsing behavior.`
*   `- [ ] **Global State Management:** Svelte stores for UI state, audio analysis results, project data, and user preferences.`

## II. Navigation & Core Shell Components

### A. Top Navigation Bar (`src/lib/components/TopBar.svelte`)
*   `- [ ] **Brand Identity Section:**
    *   `- [ ] "ARTIVUS ENGINE" wordmark with rust-peaks styling (gradient text or accent underline)
    *   `- [ ] Optional small logo/icon element incorporating rust-peaks visual identity`
*   `- [ ] **Mode Switcher (Center Focus):**
    *   `- [ ] Clean tab design inspired by Wavtool's navigation
    *   `- [ ] Tab states: Default (text-secondary), Hover (text-primary + subtle bg), Active (neon-accent-1 underline + text-primary)
    *   `- [ ] Smooth transition animations between modes
    *   `- [ ] Keyboard navigation support (arrow keys, Enter)`
*   `- [ ] **Global Actions (Right Aligned):**
    *   `- [ ] Icon buttons for Project Home, Settings, User Account (minimal MVP set)
    *   `- [ ] Tooltips with consistent styling and positioning
    *   `- [ ] Proper ARIA labels and keyboard support`
*   `- [ ] **Accessibility & Interaction:**
    *   `- [ ] Semantic HTML with proper ARIA navigation role
    *   `- [ ] Keyboard shortcuts (Cmd/Ctrl + 1/2/3 for mode switching)
    *   `- [ ] Focus management and visual focus indicators`

### B. Global State Management (`src/lib/stores/`)
*   `- [ ] **UI State Store (`uiStore.ts`):**
    *   `- [ ] Current app mode (setup/edit/export)
    *   `- [ ] Panel visibility states (left/right panel collapsed)
    *   `- [ ] Modal/dialog state management
    *   `- [ ] Loading states and progress tracking`
*   `- [ ] **Project Store (`projectStore.ts`):**
    *   `- [ ] Media assets (audio files, video clips)
    *   `- [ ] Audio analysis results (markers, stems, sections)
    *   `- [ ] Timeline state and synchronization settings`
*   `- [ ] **Audio Engine Store (`audioEngineStore.ts`):**
    *   `- [ ] Playback state, current time, tempo/pitch settings
    *   `- [ ] Audio analysis progress and results
    *   `- [ ] Real-time audio manipulation parameters`

## III. Mode-Specific Views & Workflows

### A. [SETUP] Mode: Project Initialization (`src/routes/setup/+page.svelte`)
*   `- [ ] **Welcome & Project Creation Interface:**
    *   `- [ ] Clean, centered layout emphasizing simplicity
    *   `- [ ] "Create New Project" primary action with rust-peaks accent styling
    *   `- [ ] Optional recent projects list (post-MVP) with thumbnail previews`
*   `- [ ] **Media Upload Workflow:**
    *   `- [ ] **Master Audio Upload:** Large dropzone with music note icon, drag-and-drop feedback, progress indicators
    *   `- [ ] **Video Clips Upload:** Similar interface with video icon, multiple file support
    *   `- [ ] **Upload Progress:** Elegant progress bars with neon accent fills and percentage display
    *   `- [ ] **Asset Preview:** Thumbnails and basic metadata display once uploaded`
*   `- [ ] **Transition to Edit Mode:**
    *   `- [ ] Clear call-to-action once media is uploaded
    *   `- [ ] Automatic validation of required assets before enabling [EDIT] mode access`

### B. [EDIT] Mode: Main Workspace (`src/routes/edit/+page.svelte`)

#### B.1. Layout Architecture
*   `- [ ] **CSS Grid Layout System:** Define precise grid areas for optimal space utilization:
    ```css
    .main-workspace {
      display: grid;
      grid-template-areas: 
        "asset-panel waveform-display control-panel"
        "asset-panel video-preview control-panel" 
        "asset-panel video-timeline control-panel"
        "playback-controls playback-controls playback-controls";
      grid-template-columns: 280px 1fr 320px;
      grid-template-rows: 120px 1fr 180px 80px;
    }
    ```
*   `- [ ] **Panel Collapse System:** Smooth animations, preserved proportions, responsive breakpoints.`
*   `- [ ] **Splitter/Resizer Components:** User-adjustable panel widths with constraints and snap behaviors.`

#### B.2. Master Waveform Display (`src/lib/components/WaveformDisplay.svelte`)
*   `- [ ] **Canvas Rendering Engine:**
    *   `- [ ] High-DPI support with proper scaling
    *   `- [ ] Optimized drawing for real-time updates during playback
    *   `- [ ] Waveform styling: clean amplitude visualization in light gray (#b0b0b0) against dark background`
*   `- [ ] **Marker System Visualization:**
    *   `- [ ] **Beat Markers:** Vertical lines in neon-accent-1 (#00ff88) with consistent height
    *   `- [ ] **Transient Markers:** Diamond shapes in neon-accent-2 (#ff6b35) positioned above waveform
    *   `- [ ] **Stem-Specific Markers:** Color-coded by stem type (predefined palette)
    *   `- [ ] **User Markers:** Draggable handles with unique visual styling and labels
    *   `- [ ] **Marker Interaction:** Click-to-select, drag-to-move, context menus for properties`
*   `- [ ] **Audio Sections Interface:**
    *   `- [ ] Semi-transparent colored overlays defining sections (verse, chorus, etc.)
    *   `- [ ] Section name labels with inline editing capability
    *   `- [ ] Draggable section boundaries with snap-to-marker behavior
    *   `- [ ] Section selection highlighting for control panel integration`
*   `- [ ] **Navigation & Zoom Controls:**
    *   `- [ ] Smooth zoom with mouse wheel and +/- buttons
    *   `- [ ] Pan with middle-mouse drag or scroll
    *   `- [ ] Time ruler with appropriate time divisions
    *   `- [ ] Playhead synchronization with audio playback`

#### B.3. Video Preview Area (`src/lib/components/VideoPreview.svelte`)
*   `- [ ] **WebGL2 Rendering Pipeline:**
    *   `- [ ] Canvas initialization with proper context settings
    *   `- [ ] Video texture rendering with frame synchronization
    *   `- [ ] Shader pipeline for real-time effects application
    *   `- [ ] Aspect ratio preservation (16:9) with letterboxing if needed`
*   `- [ ] **Preview Controls Overlay:**
    *   `- [ ] Minimal, non-intrusive controls that appear on hover
    *   `- [ ] Fullscreen toggle, playback state indicator
    *   `- [ ] Effect preview toggles and intensity previews`

#### B.4. Video Timeline (`src/lib/components/VideoTimeline.svelte`)
*   `- [ ] **Timeline Architecture (Wavtool-Inspired):**
    *   `- [ ] Single track layout for MVP with potential for multi-track expansion
    *   `- [ ] Time-aligned with master waveform display (shared zoom/pan context)
    *   `- [ ] Clip blocks with rounded corners and subtle shadows for depth`
*   `- [ ] **Video Clip Representation:**
    *   `- [ ] **Default State:** Dark block (#2a2a2a) with clip name overlay
    *   `- [ ] **Selected State:** Bright neon-accent-1 (#00ff88) border with thicker outline
    *   `- [ ] **Playing State:** Pulsing neon-accent-2 (#ff6b35) outline with animation
    *   `- [ ] **Thumbnail Integration:** Small preview thumbnails within blocks when space allows`
*   `- [ ] **Interaction Behaviors:**
    *   `- [ ] Drag-and-drop from asset library with visual feedback
    *   `- [ ] Click-to-select with multi-select capability (Cmd/Ctrl+click)
    *   `- [ ] Drag-to-reorder with insertion indicators
    *   `- [ ] Edge handles for trimming with cursor changes
    *   `- [ ] Context menu (right-click) with common actions`
*   `- [ ] **Timeline Features:**
    *   `- [ ] Snap-to-marker behavior during dragging
    *   `- [ ] Time ruler synchronization with waveform display
    *   `- [ ] Playhead visualization matching waveform display`

#### B.5. Asset Library Panel (`src/lib/components/AssetLibrary.svelte`)
*   `- [ ] **Panel Structure:**
    *   `- [ ] Collapsible with smooth slide animation
    *   `- [ ] Header with panel title and collapse toggle
    *   `- [ ] Scrollable content area with custom scrollbar styling`
*   `- [ ] **Asset Display:**
    *   `- [ ] Video thumbnails with overlay information (duration, resolution)
    *   `- [ ] List or grid view toggle option
    *   `- [ ] Hover effects with subtle scaling and brightness increase
    *   `- [ ] Selection state with neon accent border`
*   `- [ ] **Drag-and-Drop Integration:**
    *   `- [ ] Visual drag feedback with semi-transparent preview
    *   `- [ ] Drop zone indicators on timeline
    *   `- [ ] Touch/mobile considerations for drag interactions`
*   `- [ ] **Future Content Sections:**
    *   `- [ ] "AI Generations" placeholder section with coming soon styling
    *   `- [ ] Import additional content button with consistent button styling`

#### B.6. Audio-Driven Control Panel (`src/lib/components/AudioDrivenControlPanel.svelte`)
*   `- [ ] **Panel Architecture (Wavtool "AI & Skills" Inspired):**
    *   `- [ ] Context-sensitive content that adapts to current selection
    *   `- [ ] Smooth transitions between different states
    *   `- [ ] Clear visual hierarchy with section dividers`
*   `- [ ] **Default State Interface:**
    *   `- [ ] **Audio Analysis Tools:** Buttons for "Detect Master Beats," "Isolate Stems," "Detect Transients"
    *   `- [ ] Button styling: Secondary style with neon accent hover states
    *   `- [ ] Progress indicators for analysis operations
    *   `- [ ] "Manual Marker Mode" toggle with clear active/inactive states`
*   `- [ ] **Audio Section Selected State:**
    *   `- [ ] **Section Properties:** Editable section name with inline editing
    *   `- [ ] **Synchronization Rules Panel:**
        *   `- [ ] Dropdown for "Driving Audio Feature" with custom styling
        *   `- [ ] Numeric inputs for clip switching rules
        *   `- [ ] Speed ramp controls with min/max sliders
        *   `- [ ] Invert mapping checkbox with custom styling`
    *   `- [ ] **Effect Rules Panel:**
        *   `- [ ] Effect selection dropdown with previews
        *   `- [ ] Modulation source selection
        *   `- [ ] Real-time parameter sliders with neon accent tracks
        *   `- [ ] Attack/decay controls for pulse-based modulation`
*   `- [ ] **Stem Controls (When Available):**
    *   `- [ ] List of isolated stems with individual controls
    *   `- [ ] Solo buttons with neon active states
    *   `- [ ] Per-stem transient detection controls
    *   `- [ ] Volume/mute controls for stem preview`
*   `- [ ] **Manual Marker Mode:**
    *   `- [ ] Add marker at playhead button
    *   `- [ ] Delete selected marker button
    *   `- [ ] Marker properties panel (name, type, color)
    *   `- [ ] Marker list with selection and editing capabilities`

#### B.7. Master Playback Controls (`src/lib/components/PlaybackControls.svelte`)
*   `- [ ] **Control Layout:**
    *   `- [ ] Centered horizontal layout with consistent spacing
    *   `- [ ] Primary controls: Play/Pause (with state icon change), Stop
    *   `- [ ] Secondary controls: Loop toggle, tempo/pitch controls`
*   `- [ ] **Visual Design:**
    *   `- [ ] Larger, more prominent play/pause button with neon accent
    *   `- [ ] Icon consistency with standard media player conventions
    *   `- [ ] Hover states with subtle glow effects`
*   `- [ ] **Advanced Controls:**
    *   `- [ ] Time display (current/total) with monospace font
    *   `- [ ] Real-time tempo slider with BPM display
    *   `- [ ] Real-time pitch slider with semitone indicators
    *   `- [ ] Master volume control with visual level indication`
*   `- [ ] **Keyboard Integration:**
    *   `- [ ] Spacebar for play/pause with visual feedback
    *   `- [ ] Arrow keys for seeking (fine/coarse modes)
    *   `- [ ] Shortcut hints in tooltips`

### C. [EXPORT] Mode: Project Output (`src/routes/export/+page.svelte`)
*   `- [ ] **Export Configuration Interface:**
    *   `- [ ] Clean, focused layout emphasizing the export process
    *   `- [ ] Export format selection with quality presets
    *   `- [ ] Filename input with validation and suggestions`
*   `- [ ] **Progress & Status Display:**
    *   `- [ ] Large, prominent progress bar with neon accent fill
    *   `- [ ] Detailed status text (processing audio, rendering video, etc.)
    *   `- [ ] Time remaining estimation and cancel option`
*   `- [ ] **Export Completion:**
    *   `- [ ] Success state with download button
    *   `- [ ] File size and quality information
    *   `- [ ] Social sharing options (post-MVP)`

## IV. Component System & Design Patterns

### A. Interactive Elements
*   `- [ ] **Button Hierarchy:**
    *   `- [ ] Primary: Neon accent background, dark text
    *   `- [ ] Secondary: Transparent background, neon accent border
    *   `- [ ] Ghost: No background, neon accent text, hover background
    *   `- [ ] Icon-only: Minimal padding, consistent size`
*   `- [ ] **Form Controls:**
    *   `- [ ] Custom slider components with neon accent tracks
    *   `- [ ] Styled dropdowns with smooth animations
    *   `- [ ] Toggle switches with clear on/off states
    *   `- [ ] Input validation with inline error messaging`

### B. Feedback & Communication
*   `- [ ] **Loading States:**
    *   `- [ ] Skeleton loaders for content areas
    *   `- [ ] Spinner animations with neon accent colors
    *   `- [ ] Progress indicators for long-running operations`
*   `- [ ] **Toast Notifications:**
    *   `- [ ] Consistent positioning and animation
    *   `- [ ] Icon and color coding for different message types
    *   `- [ ] Auto-dismiss with hover-to-persist behavior`
*   `- [ ] **Modal Dialogs:**
    *   `- [ ] Dark overlay with proper backdrop dismissal
    *   `- [ ] Consistent sizing and positioning
    *   `- [ ] Focus management and keyboard navigation`

### C. Accessibility & Usability
*   `- [ ] **Keyboard Navigation:**
    *   `- [ ] Tab order optimization for workflow efficiency
    *   `- [ ] Keyboard shortcuts for frequent actions
    *   `- [ ] Visual focus indicators with neon accent styling`
*   `- [ ] **Screen Reader Support:**
    *   `- [ ] Semantic HTML structure with proper ARIA labels
    *   `- [ ] Live regions for dynamic content updates
    *   `- [ ] Alternative text for visual elements`
*   `- [ ] **Color & Contrast:**
    *   `- [ ] WCAG AA compliance for all text/background combinations
    *   `- [ ] High contrast mode consideration
    *   `- [ ] Color-blind friendly marker and state indicators`

### D. Performance & Optimization
*   `- [ ] **Rendering Optimization:**
    *   `- [ ] Canvas rendering with requestAnimationFrame
    *   `- [ ] Virtual scrolling for large asset lists
    *   `- [ ] Debounced user input handling`
*   `- [ ] **Asset Management:**
    *   `- [ ] Lazy loading for video thumbnails
    *   `- [ ] Efficient memory management for audio analysis
    *   `- [ ] Progressive enhancement for advanced features`

## V. Cross-Browser & Platform Considerations

### A. Browser Compatibility
*   `- [ ] **WebGL2 Support Detection:** Graceful fallback messaging for unsupported browsers.`
*   `- [ ] **WebCodecs Polyfills:** Consider fallback strategies for older browsers.`
*   `- [ ] **Audio Context Handling:** Proper user gesture requirements for audio playback.`

### B. Performance Targets
*   `- [ ] **Frame Rate:** Maintain 60fps for UI animations, 30fps minimum for video preview.`
*   `- [ ] **Audio Latency:** <100ms for real-time audio manipulation feedback.`
*   `- [ ] **Load Time:** Initial application load under 3 seconds on typical connection.`

### C. Responsive Considerations
*   `- [ ] **Desktop Optimization:** Primary focus on 1920x1080 and 1440p displays.`
*   `- [ ] **Minimum Resolution:** Graceful degradation to 1366x768 with panel adjustments.`
*   `- [ ] **Mobile Awareness:** Clear messaging about desktop-optimized experience.`

---

**Implementation Priority:** Focus on core [EDIT] mode components first, establishing the foundational waveform display, video timeline, and audio-driven control panel as the heart of the user experience. Build out [SETUP] and [EXPORT] modes as the core functionality stabilizes.

**Quality Assurance:** Each component should be tested for keyboard accessibility, color contrast compliance, and cross-browser compatibility before integration into the main application flow. 