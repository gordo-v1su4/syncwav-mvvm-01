// Setup for Vitest testing environment
import { expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest'; // Use the Vitest-specific entrypoint for matchers

// Mock window properties and browser APIs that might be used in tests
Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '0px',
    thresholds: [0],
    takeRecords: vi.fn().mockReturnValue([])
  }))
});

// Mock ResizeObserver
Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }))
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock AudioContext - simplified version
global.AudioContext = vi.fn().mockImplementation(() => ({
  createAnalyser: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    gain: { value: 1 },
  })),
  createBufferSource: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  })),
  decodeAudioData: vi.fn(),
  destination: {},
  currentTime: 0,
}));

// Instead of replacing the prototype method directly, we'll mock it in tests as needed
// This avoids TypeScript errors with complex interfaces like CanvasRenderingContext2D