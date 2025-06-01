// TypeScript declaration shim for the Rust WASM module
// This allows TypeScript to recognize the import path and types

declare module '../../../../../rust-modules/pkg/artivus_rust_modules' {
  export function greet(name: string): void;
  export function detect_beats(audioData: Float32Array, sampleRate: number): Float64Array;
  export function detect_transients(audioData: Float32Array, sampleRate: number): Float64Array;
  export function separate_stems(audioData: Float32Array, sampleRate: number): any;
  const _default: any;
  export default _default;
}
