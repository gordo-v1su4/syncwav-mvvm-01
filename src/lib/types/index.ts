// Application mode types
export type AppMode = 'setup' | 'edit' | 'export';

// UI panel states
export interface PanelStates {
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
}

// Project state types
export interface ProjectState {
  hasAudio: boolean;
  hasVideo: boolean;
  audioFile?: File;
  videoFiles: File[];
}

// UI Store state
export interface UIState {
  currentAppMode: AppMode;
  panelStates: PanelStates;
  projectState: ProjectState;
} 