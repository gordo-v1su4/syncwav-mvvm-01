/**
 * Core audio service for Artivus Engine
 * Handles Web Audio API integration, playback control, and real-time audio manipulation
 */

import { audioEngineStore, setTempo, setPitch, setVolume } from '$lib/stores/audioEngineStore';
import { createAudioContext, loadAudioFile } from './audioUtils';
import { get } from 'svelte/store';

export class AudioService {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;
  private animationFrameId: number | null = null;
  private startTime = 0;
  private pauseTime = 0;

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private async init() {
    try {
      this.audioContext = createAudioContext();
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      
      this.isInitialized = true;
      
      // Update store with audio context
      audioEngineStore.update(state => ({
        ...state,
        audioContext: this.audioContext!
      }));
      
    } catch (error) {
      console.error('Failed to initialize audio service:', error);
    }
  }

  /**
   * Load an audio file and prepare it for playback
   */
  async loadFile(file: File): Promise<void> {
    if (!this.audioContext || !this.isInitialized) {
      throw new Error('Audio service not initialized');
    }

    try {
      // Stop any currently playing audio
      this.stop();

      // Load and decode the audio file
      this.audioBuffer = await loadAudioFile(file, this.audioContext);
      
      // Update store with audio buffer and duration
      audioEngineStore.update(state => ({
        ...state,
        audioBuffer: this.audioBuffer!,
        totalDuration: this.audioBuffer!.duration,
        currentTime: 0
      }));

    } catch (error) {
      console.error('Failed to load audio file:', error);
      throw error;
    }
  }
  
  /**
   * Load audio from a URL (e.g., backend path)
   */
  async loadFromUrl(url: string): Promise<void> {
    console.log("AudioService.loadFromUrl called with:", url);
    
    if (!this.audioContext || !this.isInitialized) {
      console.error("AudioService not initialized");
      throw new Error('Audio service not initialized');
    }

    try {
      console.log("Stopping any current playback");
      // Stop any currently playing audio
      this.stop();

      console.log("Fetching audio data from URL");
      // Fetch the audio data
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Fetch failed with status: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }
      
      console.log("Converting response to ArrayBuffer");
      const arrayBuffer = await response.arrayBuffer();
      console.log("ArrayBuffer size:", arrayBuffer.byteLength);
      
      console.log("Decoding audio data");
      // Decode the audio data
      try {
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        console.log("Audio decoded successfully:",
          `length: ${this.audioBuffer.length}, ` +
          `duration: ${this.audioBuffer.duration}, ` +
          `channels: ${this.audioBuffer.numberOfChannels}`
        );
      } catch (decodeError) {
        console.error("Failed to decode audio:", decodeError);
        throw decodeError;
      }
      
      console.log("Updating audio engine store");
      // Update store with audio buffer and duration
      audioEngineStore.update(state => ({
        ...state,
        audioBuffer: this.audioBuffer!,
        totalDuration: this.audioBuffer!.duration,
        currentTime: 0
      }));
      
      console.log("Audio loading complete");

    } catch (error) {
      console.error('Failed to load audio from URL:', error);
      throw error;
    }
  }

  /**
   * Start audio playback
   */
  async play(): Promise<void> {
    if (!this.audioContext || !this.audioBuffer) {
      throw new Error('No audio loaded');
    }

    // Resume audio context if suspended (required by browser autoplay policies)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // If already playing, don't do anything
    if (this.sourceNode) {
      return;
    }

    // Create and configure source node
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    
    // Connect audio graph: source -> gain -> destination
    this.sourceNode.connect(this.gainNode!);
    
    // Set up playback event handlers
    this.sourceNode.onended = () => {
      this.handlePlaybackEnd();
    };
    
    // Capture offset *before* manipulating the store
    const startOffset = get(audioEngineStore).currentTime;
    
    // Start playback from the current time
    this.sourceNode.start(0, startOffset);
    this.startTime = this.audioContext.currentTime - startOffset;
    
    // Update store
    audioEngineStore.update(state => ({
      ...state,
      isPlaying: true
    }));

    // Start time tracking
    this.startTimeTracking();
  }

  /**
   * Pause audio playback
   */
  pause(): void {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode = null;
    }

    const exactTime = this.getCurrentTime();
    this.pauseTime = exactTime;
    this.stopTimeTracking();
    
    audioEngineStore.update(state => ({
      ...state,
      isPlaying: false,
      currentTime: exactTime
    }));
  }

  /**
   * Stop audio playback and reset position
   */
  stop(): void {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode = null;
    }

    this.pauseTime = 0;
    this.stopTimeTracking();

    audioEngineStore.update(state => ({
      ...state,
      isPlaying: false,
      currentTime: 0
    }));
  }

  /**
   * Seek to a specific time position
   */
  seek(time: number): void {
    const currentState = get(audioEngineStore);
    const clampedTime = Math.max(0, Math.min(time, currentState.totalDuration));
    
    const wasPlaying = currentState.isPlaying;
    
    if (wasPlaying) {
      this.pause();
    }

    audioEngineStore.update(state => ({
      ...state,
      currentTime: clampedTime
    }));

    if (wasPlaying) {
      this.play();
    }
  }

  /**
   * Set playback volume
   */
  setVolume(volume: number): void {
    if (this.gainNode) {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      this.gainNode.gain.setValueAtTime(clampedVolume, this.audioContext!.currentTime);
      setVolume(clampedVolume);
    }
  }

  /**
   * Get current playback position
   */
  getCurrentTime(): number {
    if (!this.audioContext) return 0;
    
    const currentState = get(audioEngineStore);
    
    if (currentState.isPlaying && this.startTime > 0) {
      return this.audioContext.currentTime - this.startTime;
    }
    
    return currentState.currentTime;
  }

  /**
   * Handle playback end (reached end of audio)
   */
  private handlePlaybackEnd(): void {
    const currentState = get(audioEngineStore);
    
    if (currentState.isLooping) {
      // Restart from beginning if looping
      this.seek(0);
      this.play();
    } else {
      // Stop and reset position
      this.stop();
    }
  }

  /**
   * Start tracking playback time
   */
  private startTimeTracking(): void {
    this.stopTimeTracking(); // Clear any existing tracking
    
    const updateTime = () => {
      if (!this.audioContext) return;
      
      const currentState = get(audioEngineStore);
      
      if (currentState.isPlaying) {
        const currentTime = this.getCurrentTime();
        
        // Check if we've reached the end
        if (currentTime >= currentState.totalDuration) {
          this.handlePlaybackEnd();
          return;
        }
        
        // Update current time in store
        audioEngineStore.update(state => ({
          ...state,
          currentTime: currentTime
        }));
        
        this.animationFrameId = requestAnimationFrame(updateTime);
      }
    };
    
    this.animationFrameId = requestAnimationFrame(updateTime);
  }

  /**
   * Stop tracking playback time
   */
  private stopTimeTracking(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Toggle loop mode
   */
  toggleLoop(): void {
    audioEngineStore.update(state => ({
      ...state,
      isLooping: !state.isLooping
    }));
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
    this.stopTimeTracking();
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    
    this.audioContext = null;
    this.audioBuffer = null;
    this.gainNode = null;
    this.isInitialized = false;
  }

  /**
   * Get audio context for external use
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * Get audio buffer for external use
   */
  getAudioBuffer(): AudioBuffer | null {
    return this.audioBuffer;
  }

  /**
   * Check if audio service is ready
   */
  isReady(): boolean {
    return this.isInitialized && this.audioContext !== null;
  }
}

// Create singleton instance only in browser environment
let audioService: AudioService | null = null;

if (typeof window !== 'undefined') {
  audioService = new AudioService();
}

// Export functions that safely handle the singleton
export const getAudioService = (): AudioService => {
  if (!audioService) {
    throw new Error('Audio service not available in server environment');
  }
  return audioService;
};

// Export convenience functions that use the singleton safely
export const loadAudioFromFile = (file: File) => getAudioService().loadFile(file);
export const playAudio = () => getAudioService().play();
export const pauseAudio = () => getAudioService().pause();
export const stopAudio = () => getAudioService().stop();
export const seekAudio = (time: number) => getAudioService().seek(time);
export const setAudioVolume = (volume: number) => getAudioService().setVolume(volume);
export const toggleAudioLoop = () => getAudioService().toggleLoop();

/**
 * Load audio from a URL (e.g., backend path)
 * @param url URL of the audio file to load
 * @returns Promise that resolves when the audio is loaded
 */
export const loadAudioFromUrl = async (url: string): Promise<AudioBuffer> => {
  console.log("loadAudioFromUrl called with:", url);
  try {
    console.log("Using audio service to load from URL...");
    await getAudioService().loadFromUrl(url);
    console.log("loadFromUrl completed, retrieving buffer...");
    
    const buffer = getAudioService().getAudioBuffer();
    console.log("Retrieved audio buffer:", buffer ?
      `AudioBuffer(length: ${buffer.length}, duration: ${buffer.duration}, channels: ${buffer.numberOfChannels})` :
      'null');
    
    if (!buffer) {
      console.error("Buffer is null after loading");
      throw new Error('Failed to get audio buffer after loading');
    }
    
    // Verify the buffer was set in the store too
    const storeState = get(audioEngineStore);
    console.log("AudioEngineStore state:", {
      hasBuffer: !!storeState.audioBuffer,
      duration: storeState.totalDuration,
      isPlaying: storeState.isPlaying
    });
    
    return buffer;
  } catch (error) {
    console.error('Failed to load audio from URL:', error);
    throw error;
  }
};