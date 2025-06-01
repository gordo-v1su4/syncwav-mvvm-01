// This file provides audio analysis capabilities through WASM
// Currently using Essentia.js for audio analysis with a fallback to mock implementations

import { detectBeats as essentiaDetectBeats, detectTransients as essentiaDetectTransients } from '$lib/utils/essentiaAnalysis';

// Define a type for our WASM module interface
interface WasmModule {
  greet: (name: string) => void;
  detect_beats: (audioData: Float32Array, sampleRate: number) => Float64Array;
  detect_transients: (audioData: Float32Array, sampleRate: number) => Float64Array;
  separate_stems: (audioData: Float32Array, sampleRate: number) => any;
  generate_waveform: (samples: Float32Array, downsample_factor: number) => Float32Array;
  extract_waveform_peaks: (audioData: Float32Array, samplesPerPixel: number) => any[];
}

let wasmModule: any = null;
let isInitializing = false;
let initPromise: Promise<any> | null = null;

/**
 * Initialize the WASM module
 */
export async function initWasm(): Promise<any> {
  if (wasmModule) {
    return wasmModule;
  }

  if (initPromise) {
    return initPromise;
  }

  isInitializing = true;
  
  try {
    // Use dynamic import with a URL constructor to avoid TypeScript module resolution issues
    // This ensures we're loading the JS file from the static directory
    const importPath = new URL('/artivus_rust_modules.js', window.location.origin).href;
    const rustWasmModule = await import(/* @vite-ignore */ importPath);
    
    // Fetch the WASM file explicitly
    const response = await fetch('/artivus_rust_modules_bg.wasm');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch WASM file: ${response.status} ${response.statusText}`);
    }
    
    const wasmArrayBuffer = await response.arrayBuffer();
    
    // Initialize the WASM module with the fetched binary
    if (rustWasmModule.default) {
      // Pass a single object instead of direct parameters (fixes deprecation warning)
      await rustWasmModule.default({ buffer: wasmArrayBuffer });
    } else {
      console.error('WASM module has no default export for initialization');
      throw new Error('Invalid WASM module structure');
    }
    const module: WasmModule = {
      greet: rustWasmModule.greet,
      detect_beats: rustWasmModule.detect_beats,
      detect_transients: rustWasmModule.detect_transients,
      separate_stems: rustWasmModule.separate_stems,
      generate_waveform: rustWasmModule.generate_waveform,
      extract_waveform_peaks: rustWasmModule.extract_waveform_peaks
    };
    wasmModule = module;
    isInitializing = false;
    return module;
  } catch (err) {
    console.warn('Failed to load Rust WASM module, falling back to mock:', err);
    // Fallback: mock implementation
    const module = {
      greet: (name: string) => {
        console.log(`Hello, ${name}! (WASM Module Fallback)`);
      },
      detect_beats: (audioData: Float32Array, sampleRate: number): Float64Array => {
        console.log(`Beat detection called with ${audioData.length} samples at ${sampleRate}Hz (Fallback)`);
        return new Float64Array([]);
      },
      detect_transients: (audioData: Float32Array, sampleRate: number): Float64Array => {
        console.log(`Transient detection called with ${audioData.length} samples at ${sampleRate}Hz (Fallback)`);
        return new Float64Array([]);
      },
      separate_stems: (audioData: Float32Array, sampleRate: number): any => {
        console.log(`Mock stem separation called with ${audioData.length} samples at ${sampleRate}Hz (Fallback)`);
        return [audioData, audioData];
      },
      generate_waveform: (samples: Float32Array, downsample_factor: number): Float32Array => {
        console.log(`Mock waveform generation called with ${samples.length} samples and downsample factor ${downsample_factor} (Fallback)`);
        // Create a simple fallback waveform with sine wave pattern
        const resultLength = Math.ceil(samples.length / downsample_factor);
        const result = new Float32Array(resultLength);
        for (let i = 0; i < resultLength; i++) {
          result[i] = Math.sin(i * 0.1) * 0.5;
        }
        return result;
      },
      extract_waveform_peaks: (audioData: Float32Array, samplesPerPixel: number): any[] => {
        console.log(`Mock waveform peak extraction called with ${audioData.length} samples and samplesPerPixel ${samplesPerPixel} (Fallback)`);
        // Create a simple fallback peaks array
        const resultLength = Math.ceil(audioData.length / samplesPerPixel);
        const result = [];
        for (let i = 0; i < resultLength; i++) {
          result.push({ min: -Math.sin(i * 0.1) * 0.5, max: Math.sin(i * 0.1) * 0.5 });
        }
        return result;
      }
    };
    wasmModule = module;
    isInitializing = false;
    return module;
  }
}

/**
 * Check if the WASM module is initialized
 */
export function isWasmInitialized(): boolean {
  return wasmModule !== null;
}

/**
 * Get the initialized WASM module, initializing it if necessary
 */
export async function getWasmModule(): Promise<any> {
  if (!wasmModule && !isInitializing) {
    return initWasm();
  } else if (isInitializing && initPromise) {
    return initPromise;
  } else if (wasmModule) {
    return wasmModule;
  }
  
  throw new Error('Unable to get WASM module');
}

// Audio analysis functions

/**
 * Detect beats in audio data
 */
export async function detectBeats(audioBuffer: AudioBuffer): Promise<number[]> {
  try {
    // First attempt: Use Essentia.js for more advanced analysis
    return await essentiaDetectBeats(audioBuffer);
  } catch (error) {
    console.warn('Essentia beat detection failed, falling back to WASM implementation:', error);
    
    // Fallback to WASM implementation
    const wasm = await getWasmModule();
    
    // Handle multi-channel audio by mixing down or analyzing separately
    let audioData: Float32Array;
    if (audioBuffer.numberOfChannels === 1) {
      audioData = audioBuffer.getChannelData(0);
    } else {
      // Mix down to mono for beat detection
      const length = audioBuffer.length;
      audioData = new Float32Array(length);
      for (let i = 0; i < length; i++) {
        let sample = 0;
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
          sample += audioBuffer.getChannelData(channel)[i];
        }
        audioData[i] = sample / audioBuffer.numberOfChannels;
      }
    }
    
    const sampleRate = audioBuffer.sampleRate;
    
    // Call the module function
    return Array.from(wasm.detect_beats(audioData, sampleRate));
  }
}
/**
 * Detect transients in audio data
 */
export async function detectTransients(audioBuffer: AudioBuffer): Promise<number[]> {
  try {
    // First attempt: Use Essentia.js for more advanced analysis
    return await essentiaDetectTransients(audioBuffer);
  } catch (error) {
    console.warn('Essentia transient detection failed, falling back to WASM implementation:', error);
    
    // Fallback to WASM implementation
    const wasm = await getWasmModule();
    
    // Get the first channel of audio data
    const audioData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    // Call the module function
    return Array.from(wasm.detect_transients(audioData, sampleRate));
  }
}

/**
 * Separate stems (vocals and drums) from audio data
 */
export async function separateStems(audioBuffer: AudioBuffer): Promise<{vocals: Float32Array, drums: Float32Array}> {
  const wasm = await getWasmModule();
  
  // Get the first channel of audio data
  const audioData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  
  // Call the module function
  const result = wasm.separate_stems(audioData, sampleRate);
  
  return {
    vocals: new Float32Array(result[0]),
    drums: new Float32Array(result[1])
  };
}