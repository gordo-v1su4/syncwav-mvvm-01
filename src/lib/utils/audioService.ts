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
    this.init();
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

    // Stop any existing playback
    this.stop();

    // Create and configure source node
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    
    // Connect audio graph: source -> gain -> destination
    this.sourceNode.connect(this.gainNode!);
    
    // Set up playback event handlers
    this.sourceNode.onended = () => {
      this.handlePlaybackEnd();
    };

    // Get current state for resuming from pause position
    const currentState = get(audioEngineStore);
    const startOffset = currentState.currentTime;
    
    // Start playback
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

    // Store pause position
    const currentState = get(audioEngineStore);
    this.pauseTime = currentState.currentTime;

    this.stopTimeTracking();

    audioEngineStore.update(state => ({
      ...state,
      isPlaying: false
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

// Create singleton instance
export const audioService = new AudioService();

// Export convenience functions that use the singleton
export const loadAudioFromFile = (file: File) => audioService.loadFile(file);
export const playAudio = () => audioService.play();
export const pauseAudio = () => audioService.pause();
export const stopAudio = () => audioService.stop();
export const seekAudio = (time: number) => audioService.seek(time);
export const setAudioVolume = (volume: number) => audioService.setVolume(volume);
export const toggleAudioLoop = () => audioService.toggleLoop(); 