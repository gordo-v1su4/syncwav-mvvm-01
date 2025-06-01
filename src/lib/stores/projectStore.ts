import { writable } from 'svelte/store';

export interface VideoClip {
  id: string;
  file: File;
  name: string;
  duration: number;
  thumbnail?: string;
  // Timeline position
  startTime: number;
  endTime: number;
  // Trimming
  clipStart: number; // Start time within the clip
  clipEnd: number;   // End time within the clip
  // Visual state
  isSelected: boolean;
  isPlaying: boolean;
}

export interface TimelineState {
  zoom: number; // Zoom level (1.0 = normal)
  viewStart: number; // Start time of visible area
  viewEnd: number;   // End time of visible area
  playhead: number;  // Current playhead position
  snapToMarkers: boolean;
  selectedClips: string[]; // Array of selected clip IDs
}

export interface ProjectSettings {
  name: string;
  duration: number;
  frameRate: number;
  resolution: {
    width: number;
    height: number;
  };
  audioFile?: File;
  audioFileName?: string;
}

export interface ProjectState {
  // Project metadata
  settings: ProjectSettings;
  
  // Media assets
  videoClips: VideoClip[];
  audioAssets: File[];
  
  // Timeline state
  timeline: TimelineState;
  
  // Export settings
  exportSettings: {
    format: 'mp4' | 'webm';
    quality: 'low' | 'medium' | 'high';
    includeWatermark: boolean;
  };
  
  // Project state flags
  isDirty: boolean; // Has unsaved changes
  lastSaved?: Date;
}

const initialProjectState: ProjectState = {
  settings: {
    name: 'Untitled Project',
    duration: 0,
    frameRate: 30,
    resolution: {
      width: 1920,
      height: 1080
    }
  },
  videoClips: [],
  audioAssets: [],
  timeline: {
    zoom: 1.0,
    viewStart: 0,
    viewEnd: 60, // 60 seconds default view
    playhead: 0,
    snapToMarkers: true,
    selectedClips: []
  },
  exportSettings: {
    format: 'mp4',
    quality: 'medium',
    includeWatermark: true
  },
  isDirty: false
};

export const projectStore = writable<ProjectState>(initialProjectState);

// Project settings
export const updateProjectSettings = (updates: Partial<ProjectSettings>) => {
  projectStore.update(state => ({
    ...state,
    settings: { ...state.settings, ...updates },
    isDirty: true
  }));
};

// Video clip management
export const addVideoClip = (file: File, startTime: number = 0): VideoClip => {
  const clipId = `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newClip: VideoClip = {
    id: clipId,
    file,
    name: file.name,
    duration: 0, // Will be set when video loads
    startTime,
    endTime: startTime + 5, // Default 5 second duration
    clipStart: 0,
    clipEnd: 5,
    isSelected: false,
    isPlaying: false
  };
  
  projectStore.update(state => ({
    ...state,
    videoClips: [...state.videoClips, newClip],
    isDirty: true
  }));
  
  return newClip;
};

export const removeVideoClip = (clipId: string) => {
  projectStore.update(state => ({
    ...state,
    videoClips: state.videoClips.filter(clip => clip.id !== clipId),
    timeline: {
      ...state.timeline,
      selectedClips: state.timeline.selectedClips.filter(id => id !== clipId)
    },
    isDirty: true
  }));
};

export const updateVideoClip = (clipId: string, updates: Partial<VideoClip>) => {
  projectStore.update(state => ({
    ...state,
    videoClips: state.videoClips.map(clip =>
      clip.id === clipId ? { ...clip, ...updates } : clip
    ),
    isDirty: true
  }));
};

// Timeline management
export const setTimelineZoom = (zoom: number) => {
  projectStore.update(state => ({
    ...state,
    timeline: {
      ...state.timeline,
      zoom: Math.max(0.1, Math.min(10, zoom))
    }
  }));
};

export const setTimelineView = (viewStart: number, viewEnd: number) => {
  projectStore.update(state => ({
    ...state,
    timeline: {
      ...state.timeline,
      viewStart: Math.max(0, viewStart),
      viewEnd: Math.max(viewStart + 1, viewEnd)
    }
  }));
};

export const setPlayhead = (time: number) => {
  projectStore.update(state => ({
    ...state,
    timeline: {
      ...state.timeline,
      playhead: Math.max(0, time)
    }
  }));
};

export const selectClip = (clipId: string, multiSelect = false) => {
  projectStore.update(state => {
    let selectedClips: string[];
    
    if (multiSelect) {
      selectedClips = state.timeline.selectedClips.includes(clipId)
        ? state.timeline.selectedClips.filter(id => id !== clipId)
        : [...state.timeline.selectedClips, clipId];
    } else {
      selectedClips = [clipId];
    }
    
    return {
      ...state,
      videoClips: state.videoClips.map(clip => ({
        ...clip,
        isSelected: selectedClips.includes(clip.id)
      })),
      timeline: {
        ...state.timeline,
        selectedClips
      }
    };
  });
};

export const clearSelection = () => {
  projectStore.update(state => ({
    ...state,
    videoClips: state.videoClips.map(clip => ({
      ...clip,
      isSelected: false
    })),
    timeline: {
      ...state.timeline,
      selectedClips: []
    }
  }));
};

export const toggleSnapToMarkers = () => {
  projectStore.update(state => ({
    ...state,
    timeline: {
      ...state.timeline,
      snapToMarkers: !state.timeline.snapToMarkers
    }
  }));
};

// Export settings
export const updateExportSettings = (updates: Partial<ProjectState['exportSettings']>) => {
  projectStore.update(state => ({
    ...state,
    exportSettings: { ...state.exportSettings, ...updates }
  }));
};

// Project state management
export const markProjectClean = () => {
  projectStore.update(state => ({
    ...state,
    isDirty: false,
    lastSaved: new Date()
  }));
};

export const setProjectDirty = () => {
  projectStore.update(state => ({
    ...state,
    isDirty: true
  }));
};

// Audio asset management
export const setAudioAsset = (file: File) => {
  projectStore.update(state => ({
    ...state,
    settings: {
      ...state.settings,
      audioFile: file,
      audioFileName: file.name
    },
    isDirty: true
  }));
}; 