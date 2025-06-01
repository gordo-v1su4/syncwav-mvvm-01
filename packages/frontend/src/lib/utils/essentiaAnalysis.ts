/**
 * Audio analysis utilities using Essentia.js
 * Provides beat detection, transient detection, and other audio analysis features
 */

import * as Essentia from 'essentia.js';

// Singleton pattern for Essentia instance
let essentiaInstance: any = null;

/**
 * Initialize the Essentia.js library
 * @returns Promise that resolves with the Essentia instance
 */
export async function initEssentia(): Promise<any> {
  if (essentiaInstance) {
    return essentiaInstance;
  }
  
  try {
    // Initialize Essentia WASM
    essentiaInstance = await Essentia.EssentiaWASM();
    console.log('Essentia.js initialized successfully');
    return essentiaInstance;
  } catch (error) {
    console.error('Failed to initialize Essentia.js:', error);
    throw error;
  }
}

/**
 * Convert AudioBuffer to Float32Array format needed by Essentia
 * @param audioBuffer Web Audio API AudioBuffer
 * @returns Float32Array of mono audio data
 */
function getMonoAudioData(audioBuffer: AudioBuffer): Float32Array {
  // If mono, just return the data
  if (audioBuffer.numberOfChannels === 1) {
    return audioBuffer.getChannelData(0);
  }
  
  // Mix down to mono
  const length = audioBuffer.length;
  const result = new Float32Array(length);
  
  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      sum += audioBuffer.getChannelData(channel)[i];
    }
    result[i] = sum / audioBuffer.numberOfChannels;
  }
  
  return result;
}

/**
 * Detect beats in audio using Essentia's RhythmExtractor
 * @param audioBuffer Web Audio API AudioBuffer
 * @returns Promise resolving to an array of beat times in seconds
 */
export async function detectBeats(audioBuffer: AudioBuffer): Promise<number[]> {
  try {
    // Initialize Essentia
    const essentia = await initEssentia();
    
    // Get mono audio data
    const audioData = getMonoAudioData(audioBuffer);
    const sampleRate = audioBuffer.sampleRate;
    
    // Use RhythmExtractor algorithm
    const result = essentia.RhythmExtractor2013(audioData, sampleRate);
    
    // Return beat positions in seconds
    console.log(`Detected ${result.beats.length} beats with tempo ${result.bpm}`);
    return Array.from(result.beats);
  } catch (error) {
    console.error('Error in beat detection:', error);
    
    // Fallback to basic detection if Essentia fails
    return fallbackBeatDetection(audioBuffer);
  }
}

/**
 * Detect transients (sudden changes in amplitude) using Essentia
 * @param audioBuffer Web Audio API AudioBuffer
 * @returns Promise resolving to an array of transient times in seconds
 */
export async function detectTransients(audioBuffer: AudioBuffer): Promise<number[]> {
  try {
    // Initialize Essentia
    const essentia = await initEssentia();
    
    // Get mono audio data
    const audioData = getMonoAudioData(audioBuffer);
    const sampleRate = audioBuffer.sampleRate;
    
    // Use Essentia's OnsetDetection algorithm
    // Process in frames
    const frameSize = 2048;
    const hopSize = 1024;
    const transients: number[] = [];
    
    // Create frame cutter
    const frames = essentia.FrameGenerator(audioData, frameSize, hopSize);
    
    // Configure onset detection
    const onsetAlgorithm = 'hfc'; // High Frequency Content
    const threshold = 0.3;
    
    let previousOnsetValue = 0;
    let frameIndex = 0;
    
    // Process each frame
    for (let i = 0; i < frames.size(); i++) {
      const frame = frames.get(i);
      
      // Apply window
      const windowed = essentia.Windowing(frame, 'hann');
      
      // Compute spectrum
      const spectrum = essentia.Spectrum(windowed.frame);
      
      // Detect onset
      const onset = essentia.OnsetDetection(spectrum.spectrum, spectrum.phase, onsetAlgorithm);
      
      // Check if onset is a peak
      if (onset.onsetDetection > previousOnsetValue && 
          onset.onsetDetection > threshold) {
        // Convert frame index to time
        const time = (frameIndex * hopSize) / sampleRate;
        transients.push(time);
      }
      
      previousOnsetValue = onset.onsetDetection;
      frameIndex++;
    }
    
    console.log(`Detected ${transients.length} transients`);
    return transients;
  } catch (error) {
    console.error('Error in transient detection:', error);
    
    // Fallback to basic detection if Essentia fails
    return fallbackTransientDetection(audioBuffer);
  }
}

/**
 * Fallback beat detection using simple energy-based algorithm
 * Used when Essentia.js fails
 */
function fallbackBeatDetection(audioBuffer: AudioBuffer): number[] {
  console.log('Using fallback beat detection');
  const audioData = getMonoAudioData(audioBuffer);
  const sampleRate = audioBuffer.sampleRate;
  
  // Simple energy-based beat detection
  const frameSize = Math.floor(sampleRate * 0.05); // 50ms frames
  const hopSize = Math.floor(frameSize / 2);       // 50% overlap
  const beats: number[] = [];
  
  // Calculate energy per frame
  const energies: number[] = [];
  for (let i = 0; i < audioData.length - frameSize; i += hopSize) {
    let energy = 0;
    for (let j = 0; j < frameSize; j++) {
      energy += audioData[i + j] * audioData[i + j];
    }
    energies.push(energy / frameSize);
  }
  
  // Find local peaks in energy
  const threshold = 1.5; // Adjust based on testing
  for (let i = 2; i < energies.length - 2; i++) {
    if (energies[i] > energies[i-1] && 
        energies[i] > energies[i-2] && 
        energies[i] > energies[i+1] && 
        energies[i] > energies[i+2] && 
        energies[i] > threshold * (energies.reduce((a, b) => a + b, 0) / energies.length)) {
      
      const time = (i * hopSize) / sampleRate;
      beats.push(time);
    }
  }
  
  // Ensure minimum distance between beats (tempo consistency)
  const filteredBeats: number[] = [];
  const minBeatDistance = 0.3; // seconds
  let lastBeatTime = -minBeatDistance;
  
  for (const beat of beats) {
    if (beat - lastBeatTime >= minBeatDistance) {
      filteredBeats.push(beat);
      lastBeatTime = beat;
    }
  }
  
  return filteredBeats;
}

/**
 * Fallback transient detection using simple amplitude difference algorithm
 * Used when Essentia.js fails
 */
function fallbackTransientDetection(audioBuffer: AudioBuffer): number[] {
  console.log('Using fallback transient detection');
  const audioData = getMonoAudioData(audioBuffer);
  const sampleRate = audioBuffer.sampleRate;
  
  // Improved transient detection using spectral flux
  const transients: number[] = [];
  const frameSize = Math.floor(sampleRate * 0.01); // 10ms frames
  const hopSize = Math.floor(frameSize / 4);       // 75% overlap
  
  // Calculate amplitude difference between consecutive frames
  const flux: number[] = [];
  let prevSum = 0;
  
  for (let i = 0; i < audioData.length - frameSize; i += hopSize) {
    let sum = 0;
    for (let j = 0; j < frameSize; j++) {
      sum += Math.abs(audioData[i + j]);
    }
    
    // Calculate rate of change (first derivative)
    const diff = Math.max(0, sum - prevSum);
    flux.push(diff);
    prevSum = sum;
  }
  
  // Find local peaks in flux
  const threshold = 2.0; // Adjust based on testing
  for (let i = 2; i < flux.length - 2; i++) {
    if (flux[i] > flux[i-1] && 
        flux[i] > flux[i-2] && 
        flux[i] > flux[i+1] && 
        flux[i] > flux[i+2] && 
        flux[i] > threshold * (flux.reduce((a, b) => a + b, 0) / flux.length)) {
      
      const time = (i * hopSize) / sampleRate;
      transients.push(time);
    }
  }
  
  // Ensure minimum distance between transients
  const filteredTransients: number[] = [];
  const minTransientDistance = 0.05; // seconds
  let lastTransientTime = -minTransientDistance;
  
  for (const transient of transients) {
    if (transient - lastTransientTime >= minTransientDistance) {
      filteredTransients.push(transient);
      lastTransientTime = transient;
    }
  }
  
  return filteredTransients;
}