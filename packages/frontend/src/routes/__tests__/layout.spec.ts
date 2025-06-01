import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Layout from '../+layout.svelte';
import { uiStore } from '$lib/stores/uiStore';

// Mock the uiStore
vi.mock('$lib/stores/uiStore', () => {
  const store = {
    subscribe: vi.fn((callback) => {
      callback({
        currentAppMode: 'entry',
        panelStates: {
          leftPanelCollapsed: false,
          rightPanelCollapsed: false
        },
        projectState: {
          hasAudio: false,
          hasVideo: false,
          videoFiles: []
        },
        loadingStates: {
          audioAnalysis: false,
          stemIsolation: false,
          transientDetection: false,
          mediaUpload: false
        },
        modalState: {
          isOpen: false,
          type: null,
          data: null
        }
      });
      return () => {};
    })
  };
  
  return {
    uiStore: store,
    setAppMode: vi.fn()
  };
});

// Mock the components
vi.mock('$lib/components/ModeSwitcher.svelte', () => {
  return {
    default: class MockModeSwitcher {
      constructor() {}
      $render() {
        return '<div data-testid="mock-mode-switcher"></div>';
      }
    }
  };
});

vi.mock('$lib/components/GlobalHeader.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $$type: 'svelte:component',
    render: () => '<div data-testid="mock-global-header"></div>'
  }))
}));

vi.mock('$lib/components/AppEntryHubView.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $$type: 'svelte:component',
    render: () => '<div data-testid="mock-app-entry-hub-view"></div>'
  }))
}));

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the app shell with required components', () => {
    const { container, getByTestId } = render(Layout);
    
    // Check for main structure
    expect(container.querySelector('.app-shell')).toBeTruthy();
    expect(container.querySelector('.main-content')).toBeTruthy();
    
    // Check for components
    expect(getByTestId('mock-mode-switcher')).toBeTruthy();
    expect(getByTestId('mock-global-header')).toBeTruthy();
  });

it('shows the correct view based on current mode', () => {
    const { getByTestId } = render(Layout);
    expect(getByTestId('mock-app-entry-hub-view')).toBeTruthy();
   });

  it('renders different views for each app mode', () => {
    // Test would require updating the mock store for each mode
    // 'setup', 'edit', 'export', 'settings' modes
    // This ensures the conditional rendering works correctly
  });
    // 'setup', 'edit', 'export', 'settings' modes
    // This ensures the conditional rendering works correctly
  });
});