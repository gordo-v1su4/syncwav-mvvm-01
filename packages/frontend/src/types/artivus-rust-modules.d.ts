// Global TypeScript declaration for the Rust WASM module alias (best practices: place in src/types)

declare module 'artivus-rust-modules' {
  export function greet(name: string): void;
  export function detect_beats(audioData: Float32Array, sampleRate: number): Float64Array;
  export function detect_transients(audioData: Float32Array, sampleRate: number): Float64Array;
  export function separate_stems(audioData: Float32Array, sampleRate: number): any;
  const _default: any;
  export default _default;
}
