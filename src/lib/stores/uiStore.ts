import { writable } from 'svelte/store';
import type { AppMode, UIState } from '$lib/types';

// Create the initial UI state
const initialUIState: UIState = {
  currentAppMode: 'setup',
  panelStates: {
    leftPanelCollapsed: false,
    rightPanelCollapsed: false
  },
  projectState: {
    hasAudio: false,
    hasVideo: false,
    videoFiles: []
  }
};

// Create the main UI store
export const uiStore = writable<UIState>(initialUIState);

// Convenience functions for updating specific parts of the state
export const setAppMode = (mode: AppMode) => {
  uiStore.update(state => ({
    ...state,
    currentAppMode: mode
  }));
};

export const toggleLeftPanel = () => {
  uiStore.update(state => ({
    ...state,
    panelStates: {
      ...state.panelStates,
      leftPanelCollapsed: !state.panelStates.leftPanelCollapsed
    }
  }));
};

export const toggleRightPanel = () => {
  uiStore.update(state => ({
    ...state,
    panelStates: {
      ...state.panelStates,
      rightPanelCollapsed: !state.panelStates.rightPanelCollapsed
    }
  }));
};

export const setAudioFile = (file: File) => {
  uiStore.update(state => ({
    ...state,
    projectState: {
      ...state.projectState,
      audioFile: file,
      hasAudio: true
    }
  }));
};

export const addVideoFile = (file: File) => {
  uiStore.update(state => ({
    ...state,
    projectState: {
      ...state.projectState,
      videoFiles: [...state.projectState.videoFiles, file],
      hasVideo: true
    }
  }));
}; 