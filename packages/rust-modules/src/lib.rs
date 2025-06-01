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
    console_log!("Stem separation called with {} samples at {}Hz", audio_data.len(), sample_rate);
    
    // TODO: Implement actual stem separation
    // For now, return the same audio for both "vocals" and "drums"
    let vocals = js_sys::Float32Array::from(audio_data);
    let drums = js_sys::Float32Array::from(audio_data);
    
    let result = js_sys::Array::new();
    result.push(&vocals);
    result.push(&drums);
    
    result
}

#[cfg(test)]
mod tests {
    use super::*;

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
        assert!(beats.len() >= 19); // 10 seconds / 0.5 seconds per beat = 20 beats, but loop condition is < duration
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
}