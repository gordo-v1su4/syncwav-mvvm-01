import { writable } from 'svelte/store';
import type { AudioMarker, AudioSection } from '$lib/types';

export interface AudioEngineState {
  // Playback state
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  isLooping: boolean;
  
  // Audio manipulation
  tempo: number; // BPM
  pitch: number; // semitones
  volume: number; // 0-1
  
  // Analysis results
  markers: AudioMarker[];
  sections: AudioSection[];
  stems: {
    vocals?: AudioBuffer;
    drums?: AudioBuffer;
    bass?: AudioBuffer;
    other?: AudioBuffer;
  };
  
  // Analysis progress
  analysisProgress: {
    beatDetection: number;
    stemIsolation: number;
    transientDetection: number;
  };
  
  // Audio context state
  audioContext?: AudioContext;
  audioBuffer?: AudioBuffer;
  sourceNode?: AudioBufferSourceNode;
}

const initialAudioEngineState: AudioEngineState = {
  isPlaying: false,
  currentTime: 0,
  totalDuration: 0,
  isLooping: false,
  tempo: 120,
  pitch: 0,
  volume: 0.8,
  markers: [],
  sections: [],
  stems: {},
  analysisProgress: {
    beatDetection: 0,
    stemIsolation: 0,
    transientDetection: 0
  }
};

export const audioEngineStore = writable<AudioEngineState>(initialAudioEngineState);

// Playback control functions
export const play = () => {
  audioEngineStore.update(state => ({ ...state, isPlaying: true }));
};

export const pause = () => {
  audioEngineStore.update(state => ({ ...state, isPlaying: false }));
};

export const stop = () => {
  audioEngineStore.update(state => ({ 
    ...state, 
    isPlaying: false, 
    currentTime: 0 
  }));
};

export const seek = (time: number) => {
  audioEngineStore.update(state => ({ 
    ...state, 
    currentTime: Math.max(0, Math.min(time, state.totalDuration))
  }));
};

export const setTempo = (bpm: number) => {
  audioEngineStore.update(state => ({ 
    ...state, 
    tempo: Math.max(60, Math.min(180, bpm))
  }));
};

export const setPitch = (semitones: number) => {
  audioEngineStore.update(state => ({ 
    ...state, 
    pitch: Math.max(-12, Math.min(12, semitones))
  }));
};

export const setVolume = (volume: number) => {
  audioEngineStore.update(state => ({ 
    ...state, 
    volume: Math.max(0, Math.min(1, volume))
  }));
};

export const toggleLoop = () => {
  audioEngineStore.update(state => ({ 
    ...state, 
    isLooping: !state.isLooping
  }));
};

// Marker management
export const addMarker = (marker: AudioMarker) => {
  audioEngineStore.update(state => ({
    ...state,
    markers: [...state.markers, marker].sort((a, b) => a.time - b.time)
  }));
};

export const removeMarker = (markerId: string) => {
  audioEngineStore.update(state => ({
    ...state,
    markers: state.markers.filter(m => m.id !== markerId)
  }));
};

export const updateMarker = (markerId: string, updates: Partial<AudioMarker>) => {
  audioEngineStore.update(state => ({
    ...state,
    markers: state.markers.map(m => 
      m.id === markerId ? { ...m, ...updates } : m
    )
  }));
};

// Section management
export const addSection = (section: AudioSection) => {
  audioEngineStore.update(state => ({
    ...state,
    sections: [...state.sections, section].sort((a, b) => a.startTime - b.startTime)
  }));
};

export const removeSection = (sectionId: string) => {
  audioEngineStore.update(state => ({
    ...state,
    sections: state.sections.filter(s => s.id !== sectionId)
  }));
};

export const updateSection = (sectionId: string, updates: Partial<AudioSection>) => {
  audioEngineStore.update(state => ({
    ...state,
    sections: state.sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    )
  }));
};

// Analysis progress
export const setAnalysisProgress = (
  type: keyof AudioEngineState['analysisProgress'], 
  progress: number
) => {
  audioEngineStore.update(state => ({
    ...state,
    analysisProgress: {
      ...state.analysisProgress,
      [type]: Math.max(0, Math.min(1, progress))
    }
  }));
};

// Audio context management
export const initAudioContext = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  audioEngineStore.update(state => ({ ...state, audioContext }));
  return audioContext;
};

export const loadAudioBuffer = async (file: File): Promise<AudioBuffer> => {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = await new Promise<AudioContext>((resolve) => {
    audioEngineStore.subscribe(state => {
      if (state.audioContext) {
        resolve(state.audioContext);
      }
    })();
  });
  
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  audioEngineStore.update(state => ({
    ...state,
    audioBuffer,
    totalDuration: audioBuffer.duration
  }));
  
  return audioBuffer;
}; 