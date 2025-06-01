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

/**
 * Generate peak data from an AudioBuffer for waveform visualization
 * @param audioBuffer - The decoded audio buffer
 * @param samplesPerPixel - Number of audio samples per pixel (controls detail level)
 * @returns Array of min/max peak pairs for rendering
 */
export function generateWaveformPeaks(
  audioBuffer: AudioBuffer, 
  samplesPerPixel: number = 512
): AudioPeakData[] {
  // Merge all channels by taking the max / min per sample index
const channelCount = audioBuffer.numberOfChannels;
const channelData = new Float32Array(audioBuffer.length);
for (let ch = 0; ch < channelCount; ch++) {
// Merge all channels by taking the max / min per sample index
const channelCount = audioBuffer.numberOfChannels;
const channelData = new Float32Array(audioBuffer.length);
for (let ch = 0; ch < channelCount; ch++) {
  const data = audioBuffer.getChannelData(ch);
  for (let i = 0; i < data.length; i++) {
    // Keep the extreme values across channels
    channelData[i] = Math.max(channelData[i] ?? -1, data[i]);
  }
}
  for (let i = 0; i < data.length; i++) {
    // Keep the extreme values across channels
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
  
  return peaks;
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
if (canvasWidth <= 0) return samplesPerPixel; // sensible fallback
const visibleSamples = totalSamples / zoom;
return Math.ceil(visibleSamples / canvasWidth);
} 