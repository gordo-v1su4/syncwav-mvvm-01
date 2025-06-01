// Global TypeScript declaration for the Rust WASM module alias

declare module 'artivus-rust-modules' {
  export function greet(name: string): void;
  export function detect_beats(audioData: Float32Array, sampleRate: number): Float64Array;
  export function detect_transients(audioData: Float32Array, sampleRate: number): Float64Array;
  export function separate_stems(audioData: Float32Array, sampleRate: number): any;
  export function extract_waveform_peaks(audioData: Float32Array, samplesPerPixel: number): any[];
  export function generate_waveform(samples: Float32Array, downsample_factor: number): Float32Array;
  const _default: any;
  export default _default;
}
