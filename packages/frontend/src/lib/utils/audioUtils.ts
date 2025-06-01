/**
 * Audio utility functions for Artivus Engine
 * Handles audio processing, waveform generation, and audio buffer management
 */

export interface WaveformData {
  peaks: Float32Array;
  length: number;
  sampleRate: number;
  duration: number;
}

export interface AudioPeakData {
  min: number;
  max: number;
}

import { getWasmModule } from '$lib/wasm/index';

/**
 * Merge all channels of an AudioBuffer to mono (average per sample).
 * This is required for passing to WASM peak extraction.
 */
function mergeToMono(buffer: AudioBuffer): Float32Array {
  const len = buffer.length;
  const channels = buffer.numberOfChannels;
  if (channels === 1) return buffer.getChannelData(0);
  const mono = new Float32Array(len);
  for (let ch = 0; ch < channels; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      mono[i] += data[i] / channels;
    }
  }
  return mono;
}

/**
 * Generate peak data from an AudioBuffer for waveform visualization using Rust/WASM for speed.
 * Falls back to JS if WASM is unavailable.
 */
export async function generateWaveformPeaks(
  audioBuffer: AudioBuffer, 
  samplesPerPixel: number = 512
): Promise<AudioPeakData[]> {
  // Use WASM for peak extraction if available
  try {
    const mono = mergeToMono(audioBuffer);
    const wasm = await getWasmModule();
    if (wasm.extract_waveform_peaks) {
      const wasmPeaks = wasm.extract_waveform_peaks(mono, samplesPerPixel);
      if (Array.isArray(wasmPeaks) && wasmPeaks.length > 0 && 'min' in wasmPeaks[0] && 'max' in wasmPeaks[0]) {
        return wasmPeaks as AudioPeakData[];
      }
      console.warn('[audioUtils] WASM extract_waveform_peaks returned unexpected result, falling back to JS.');
    } else {
      console.warn('[audioUtils] WASM module missing extract_waveform_peaks, falling back to JS.');
    }
  } catch (err) {
    console.error('[audioUtils] WASM extract_waveform_peaks failed:', err);
  }

  // --- JS fallback ---
  console.warn('[audioUtils] Using JS fallback for peak extraction.');
  console.log('[audioUtils] Fallback: audioBuffer.length', audioBuffer.length, 'channels', audioBuffer.numberOfChannels);
  if (audioBuffer.length > 0) {
    let monoPreview = [];
    for (let i = 0; i < Math.min(10, audioBuffer.length); i++) {
      let sample = 0;
      for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
        sample += audioBuffer.getChannelData(ch)[i];
      }
      monoPreview.push(sample / audioBuffer.numberOfChannels);
    }
    console.log('[audioUtils] Fallback: first 10 mono samples', monoPreview);
  }
  const channelCount = audioBuffer.numberOfChannels;
  const channelData = new Float32Array(audioBuffer.length);
  for (let ch = 0; ch < channelCount; ch++) {
    const data = audioBuffer.getChannelData(ch);
    for (let i = 0; i < data.length; i++) {
      channelData[i] = Math.max(channelData[i] ?? -1, data[i]);
    }
  }
  const peaks: AudioPeakData[] = [];
  const blockSize = samplesPerPixel;
  for (let i = 0; i < channelData.length; i += blockSize) {
    let min = 1;
    let max = -1;
    for (let j = 0; j < blockSize && i + j < channelData.length; j++) {
      const sample = channelData[i + j];
      if (sample > max) max = sample;
      if (sample < min) min = sample;
    }
    peaks.push({ min, max });
  }
  console.warn(`[audioUtils] JS fallback generated ${peaks.length} peaks.`);
  return peaks;
}

/**
 * Generate waveform data from an AudioBuffer using Rust/WASM for speed.
 * Falls back to JS if WASM is unavailable.
 */
export async function generateWaveform(audioBuffer: AudioBuffer, downsampleFactor: number = 100): Promise<Float32Array> {
  if (!audioBuffer || audioBuffer.length === 0) {
    console.error('[audioUtils] generateWaveform called with invalid or empty audioBuffer');
    return new Float32Array();
  }

  try {
    // Convert audio to mono
    const mono = mergeToMono(audioBuffer);
    
    console.log('[audioUtils] Attempting to get WASM module for waveform generation');
    console.log('[audioUtils] Audio data:', {
      channels: audioBuffer.numberOfChannels,
      length: audioBuffer.length,
      sampleRate: audioBuffer.sampleRate,
      duration: audioBuffer.duration,
      monoLength: mono.length
    });
    
    // Get WASM module
    const wasm = await getWasmModule();
    
    if (!wasm) {
      console.error('[audioUtils] Failed to get WASM module');
      return fallbackGenerateWaveform(mono, downsampleFactor);
    }
    
    // Check if the module has the waveform generation function
    if (wasm.generate_waveform) {
      console.log('[audioUtils] Using WASM generate_waveform with downsample factor:', downsampleFactor);
      
      // Call the WASM function to generate peaks
      const peaks = wasm.generate_waveform(mono, downsampleFactor);
      
      if (peaks && peaks.length > 0) {
        console.log('[audioUtils] WASM generate_waveform successful:', peaks.length, 'peaks');
        console.log('[audioUtils] First 10 peaks:', Array.from(peaks.slice(0, 10)));
        return peaks;
      } else {
        console.error('[audioUtils] WASM generate_waveform returned empty result');
      }
    } else {
      console.warn('[audioUtils] WASM module missing generate_waveform function');
    }
  } catch (err) {
    console.error('[audioUtils] WASM generate_waveform failed:', err);
  }
  
  // Fallback to JS implementation
  return fallbackGenerateWaveform(mergeToMono(audioBuffer), downsampleFactor);
}

/**
 * JavaScript fallback implementation for waveform generation
 */
function fallbackGenerateWaveform(monoData: Float32Array, downsampleFactor: number): Float32Array {
  console.log('[audioUtils] Using JS fallback for waveform generation');
  
  const length = monoData.length;
  const resultLength = Math.ceil(length / downsampleFactor);
  const result = new Float32Array(resultLength);
  
  for (let i = 0; i < resultLength; i++) {
    const start = i * downsampleFactor;
    const end = Math.min(start + downsampleFactor, length);
    
    let maxAmp = 0;
    for (let j = start; j < end; j++) {
      maxAmp = Math.max(maxAmp, Math.abs(monoData[j]));
    }
    
    result[i] = maxAmp;
  }
  
  console.log('[audioUtils] JS fallback generated', result.length, 'peaks');
  console.log('[audioUtils] First 10 peaks:', Array.from(result.slice(0, 10)));
  
  return result;
}

// Legacy sync wrapper for compatibility (warns and calls async)
export function generateWaveformPeaksSync(audioBuffer: AudioBuffer, samplesPerPixel: number = 512): AudioPeakData[] {
  console.warn('[audioUtils] generateWaveformPeaksSync is deprecated. Use async version instead.');
  // This will NOT work as expected - always use the async version in new code.
  // For compatibility, this will block and return an empty array.
  // Consider refactoring callers to use the async version.
  return [];
}


/**
 * Create an AudioContext with proper browser compatibility
 */
export function createAudioContext(): AudioContext {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    throw new Error('AudioContext is not available in server-side environment');
  }
  
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContextClass();
}

/**
 * Load and decode an audio file into an AudioBuffer
 * @param file - The audio file to load
 * @param audioContext - The audio context to use for decoding
 * @returns Promise resolving to the decoded AudioBuffer
 */
export async function loadAudioFile(file: File, audioContext: AudioContext): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

/**
 * Convert time in seconds to formatted time string (MM:SS or H:MM:SS)
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Convert time position to pixel position for waveform display
 * @param time - Time in seconds
 * @param duration - Total duration in seconds
 * @param width - Canvas width in pixels
 * @param zoom - Zoom level (1.0 = normal)
 * @param offset - Scroll offset in seconds
 * @returns Pixel position
 */
export function timeToPixel(
  time: number, 
  duration: number, 
  width: number, 
  zoom: number = 1.0, 
  offset: number = 0
): number {
  const visibleDuration = duration / zoom;
  const visibleTime = time - offset;
  return (visibleTime / visibleDuration) * width;
}

/**
 * Convert pixel position to time for waveform display
 * @param pixel - Pixel position
 * @param duration - Total duration in seconds
 * @param width - Canvas width in pixels
 * @param zoom - Zoom level (1.0 = normal)
 * @param offset - Scroll offset in seconds
 * @returns Time in seconds
 */
export function pixelToTime(
  pixel: number, 
  duration: number, 
  width: number, 
  zoom: number = 1.0, 
  offset: number = 0
): number {
  const visibleDuration = duration / zoom;
  const timeInView = (pixel / width) * visibleDuration;
  return timeInView + offset;
}

/**
 * Validate if a file is a supported audio format
 * @param file - File to validate
 * @returns true if supported audio format
 */
export function isValidAudioFile(file: File): boolean {
  const supportedTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/flac',
    'audio/ogg',
    'audio/webm'
  ];
  
  return supportedTypes.includes(file.type.toLowerCase());
}

/**
 * Validate if a file is a supported video format
 * @param file - File to validate
 * @returns true if supported video format
 */
export function isValidVideoFile(file: File): boolean {
  const supportedTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime'
  ];
  
  return supportedTypes.includes(file.type.toLowerCase());
}

/**
 * Generate a unique ID for markers, clips, etc.
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Clamp a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate the optimal samples per pixel for waveform rendering
 * @param audioBuffer - The audio buffer
 * @param canvasWidth - Width of the canvas in pixels
 * @param zoom - Current zoom level
 * @returns Optimal samples per pixel
 */
export function calculateSamplesPerPixel(
  audioBuffer: AudioBuffer, 
  canvasWidth: number, 
  zoom: number = 1.0
): number {
    const totalSamples = audioBuffer.length;
    // Default fallback value
    const defaultSamplesPerPixel = 512;
    
    if (canvasWidth <= 0) return defaultSamplesPerPixel;
    
    const visibleSamples = totalSamples / zoom;
    return Math.ceil(visibleSamples / canvasWidth);
} 