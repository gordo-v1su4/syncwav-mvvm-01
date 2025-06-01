// Application mode types
export type AppMode = 'entry' | 'setup' | 'edit' | 'export' | 'settings';

// UI panel states
export interface PanelStates {
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
}

// Loading states for various operations
export interface LoadingStates {
  audioAnalysis: boolean;
  stemIsolation: boolean;
  transientDetection: boolean;
  mediaUpload: boolean;
}

// Modal state management
export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: any;
}

// Project state types
export interface ProjectState {
  hasAudio: boolean;
  hasVideo: boolean;
  audioFile?: File;
  videoFiles: File[];
}

// Audio waveform data types
export interface AudioPeakData {
  min: number;
  max: number;
}

export interface WaveformData {
  peaks: Float32Array;
  length: number;
  sampleRate: number;
  duration: number;
}

// Audio analysis types
export interface AudioMarker {
  id: string;
  time: number;
  type: 'beat' | 'transient' | 'user' | 'stem';
  label?: string;
  stemType?: string;
  color?: string;
}

export interface AudioSection {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  drivingFeature?: string;
  syncRules?: SyncRules;
}

export interface SyncRules {
  clipSwitching?: {
    enabled: boolean;
    interval: number;
    markerType: string;
  };
  speedRamps?: {
    enabled: boolean;
    audioSource: string;
    minSpeed: number;
    maxSpeed: number;
    invertMapping: boolean;
  };
  effects?: {
    enabled: boolean;
    effectType: string;
    modulationSource: string;
    intensity: number;
    attackDecay?: {
      attack: number;
      decay: number;
    };
  };
}

// UI Store state
export interface UIState {
  currentAppMode: AppMode;
  panelStates: PanelStates;
  projectState: ProjectState;
  loadingStates: LoadingStates;
  modalState: ModalState;
} 