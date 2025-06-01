use wasm_bindgen::prelude::*;

// Import the `console.log` function from the browser for debugging
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Define a macro to make console logging easier
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

// Basic greeting function to test WASM integration
#[wasm_bindgen]
pub fn greet(name: &str) {
    console_log!("Hello, {}! from Rust and WebAssembly!", name);
}

// Placeholder for beat detection function
#[wasm_bindgen]
 pub fn detect_beats(audio_data: &[f32], sample_rate: f32) -> Vec<f64> {
    if audio_data.is_empty() {
        console_log!("Warning: Empty audio data provided to detect_beats");
        return Vec::new();
    }
    
    if sample_rate <= 0.0 {
        console_log!("Error: Invalid sample rate: {}", sample_rate);
        return Vec::new();
    }
    
     console_log!("Beat detection called with {} samples at {}Hz", audio_data.len(), sample_rate);
     
     // TODO: Implement actual beat detection algorithm
     // For now, return dummy beat timestamps every 0.5 seconds
     let duration = audio_data.len() as f64 / sample_rate as f64;
     let mut beats = Vec::new();
     let mut time = 0.5;
     
     while time < duration {
         beats.push(time);
         time += 0.5;
     }
     
     beats
 }

// Placeholder for transient detection function
#[wasm_bindgen]
pub fn detect_transients(audio_data: &[f32], sample_rate: f32) -> Vec<f64> {
    console_log!("Transient detection called with {} samples at {}Hz", audio_data.len(), sample_rate);
    
    // TODO: Implement actual transient detection algorithm
    // For now, return dummy transient timestamps
    let duration = audio_data.len() as f64 / sample_rate as f64;
    let mut transients = Vec::new();
    let mut time = 0.25;
    
    while time < duration {
        transients.push(time);
        time += 0.75;
    }
    
    transients
}

// Placeholder for stem separation function  
#[wasm_bindgen]
pub fn separate_stems(audio_data: &[f32], sample_rate: f32) -> js_sys::Array {
    let result = js_sys::Array::new();
    
    if audio_data.is_empty() {
        console_log!("Warning: Empty audio data provided to separate_stems");
        return result;
    }
    
    if sample_rate <= 0.0 {
        console_log!("Error: Invalid sample rate: {}", sample_rate);
        return result;
    }
    
     console_log!("Stem separation called with {} samples at {}Hz", audio_data.len(), sample_rate);
     
     // TODO: Implement actual stem separation
     // For now, return the same audio for both "vocals" and "drums"
     let vocals = js_sys::Float32Array::from(audio_data);
     let drums = js_sys::Float32Array::from(audio_data);
     
     result.push(&vocals);
     result.push(&drums);
     
     result
}

// Fast, DAW-grade waveform peak extraction for WASM
#[wasm_bindgen]
pub fn extract_waveform_peaks(audio_data: &[f32], samples_per_pixel: usize) -> js_sys::Array {
    let len = audio_data.len();
    let peaks = js_sys::Array::new();
    if len == 0 || samples_per_pixel == 0 {
        console_log!("extract_waveform_peaks: Invalid input: len={}, spp={}", len, samples_per_pixel);
        return peaks;
    }
    let mut i = 0;
    while i < len {
        let mut min = f32::MAX;
        let mut max = f32::MIN;
        let end = usize::min(i + samples_per_pixel, len);
        for &sample in &audio_data[i..end] {
            if sample < min { min = sample; }
            if sample > max { max = sample; }
        }
        let peak = js_sys::Object::new();
        js_sys::Reflect::set(&peak, &"min".into(), &min.into()).unwrap();
        js_sys::Reflect::set(&peak, &"max".into(), &max.into()).unwrap();
        peaks.push(&peak);
        i += samples_per_pixel;
    }
    peaks
}

// Simple peak amplitude waveform generator for Float32Array input (downsampled max-abs)
#[wasm_bindgen]
pub fn generate_waveform(samples: &js_sys::Float32Array, downsample_factor: usize) -> js_sys::Float32Array {
    let samples_vec = samples.to_vec();
    let mut peaks = Vec::new();
    for chunk in samples_vec.chunks(downsample_factor) {
        let max: f32 = chunk.iter().fold(0.0, |acc, &x| acc.max(x.abs()));
        peaks.push(max);
    }
    js_sys::Float32Array::from(peaks.as_slice())
}


#[cfg(test)]
mod tests {
    use super::*;
    // Only import wasm_bindgen_test if targeting wasm32
    #[cfg(target_arch = "wasm32")]
    use wasm_bindgen_test::wasm_bindgen_test;

    #[test]
    fn test_greet() {
        // This function primarily logs to console, so direct testing of output is hard.
        // We can at least ensure it compiles and runs without panicking.
        greet("TestUser");
        assert!(true); // If it reaches here, it didn't panic.
    }

    #[test]
    fn test_detect_beats_dummy_output() {
        let audio_data = vec![0.0; 44100 * 10]; // 10 seconds of audio
        let sample_rate = 44100.0;
        let beats = detect_beats(&audio_data, sample_rate);
        
// Expecting dummy beats every 0.5 seconds
         assert!(!beats.is_empty());
        assert_eq!(beats.len(), 19); // 10 seconds with beats at 0.5, 1.0, 1.5... 9.5 = 19 beats
         assert!(beats[0] == 0.5);
         assert!(beats[1] == 1.0);
    }

    #[test]
    fn test_detect_transients_dummy_output() {
        let audio_data = vec![0.0; 44100 * 10]; // 10 seconds of audio
        let sample_rate = 44100.0;
        let transients = detect_transients(&audio_data, sample_rate);

        // Expecting dummy transients every 0.75 seconds
        assert!(!transients.is_empty());
        assert!(transients.len() >= 13); // 10 seconds / 0.75 seconds per transient = 13.33, so 13 or more
        assert!(transients[0] == 0.25);
        assert!(transients[1] == 1.0);
    }

    #[test]
    fn test_separate_stems_dummy_output() {
        let audio_data = vec![0.0; 100];
        let sample_rate = 44100.0;
        let result = separate_stems(&audio_data, sample_rate);

        assert_eq!(result.length(), 2);
        let vocals = js_sys::Float32Array::from(result.get(0));
        let drums = js_sys::Float32Array::from(result.get(1));

        assert_eq!(vocals.length(), audio_data.len() as u32);
        assert_eq!(drums.length(), audio_data.len() as u32);
        // Since it's dummy, we expect the content to be the same as input
        for i in 0..audio_data.len() {
            assert_eq!(vocals.get_index(i as u32), audio_data[i]);
            assert_eq!(drums.get_index(i as u32), audio_data[i]);
        }
    }

    // Sample wasm_bindgen_test for browser/wasm testing
    #[cfg(target_arch = "wasm32")]
    #[wasm_bindgen_test]
    fn test_wasm_bindgen_sample() {
        // This test always passes
        assert_eq!(1 + 1, 2);
    }
}