import { render } from '@testing-library/svelte/svelte5';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import WaveformDisplay from '../WaveformDisplay.svelte';
import { audioEngineStore } from '$lib/stores/audioEngineStore';

// Mock the audioEngineStore
vi.mock('$lib/stores/audioEngineStore', () => {
  const store = {
    subscribe: vi.fn((callback) => {
      callback({
        currentTime: 0,
        totalDuration: 60,
        isPlaying: false,
        markers: []
      });
      return () => {};
    })
  };
  
  return {
    audioEngineStore: store
  };
});

// Mock canvas rendering context
const mockContext = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  closePath: vi.fn(),
  setLineDash: vi.fn(),
  scale: vi.fn(),
  fillText: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  font: '',
  textAlign: ''
};

describe('WaveformDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup canvas mock before each test
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
      return mockContext as unknown as CanvasRenderingContext2D;
    });
    
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 800,
      height: 120,
      top: 0,
      left: 0,
      bottom: 120,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => {}
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the waveform component with empty state when no audio is provided', async () => {
    const { findByText } = render(WaveformDisplay);
    
    expect(await findByText('No Audio Loaded')).toBeTruthy();
  });

  it('displays zoom indicator', async () => {
    const { findByText } = render(WaveformDisplay);
    
    expect(await findByText('Zoom: 1.0x')).toBeTruthy();
  });

  it('sets up the canvas when mounted', async () => {
    render(WaveformDisplay);
    // Wait a tick for Svelte's onMount
    await Promise.resolve();
    expect(mockContext.clearRect).toHaveBeenCalled();
  });

  // This test would require more complex mocking of AudioBuffer and canvas APIs
  it.todo('generates peaks and renders waveform when audio buffer is provided');
});