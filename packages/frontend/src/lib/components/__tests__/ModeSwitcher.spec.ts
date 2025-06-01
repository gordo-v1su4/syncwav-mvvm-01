import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ModeSwitcher from '../ModeSwitcher.svelte';
import { uiStore, setAppMode } from '$lib/stores/uiStore';
import type { UIState } from '$lib/types';

// Mock the store and its functions
vi.mock('$lib/stores/uiStore', () => {
  const mockState: UIState = {
    currentAppMode: 'setup',
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
  };
  
  const store = {
    subscribe: vi.fn((callback) => {
      callback(mockState);
      return () => {};
    }),
    update: vi.fn()
  };
  
  return {
    uiStore: store,
    setAppMode: vi.fn((mode) => {
      mockState.currentAppMode = mode;
      store.update(state => ({ ...state, currentAppMode: mode }));
    })
  };
});

describe('ModeSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all tabs', () => {
    const { getByText } = render(ModeSwitcher);
    
    expect(getByText('[SETUP]')).toBeTruthy();
    expect(getByText('[EDIT]')).toBeTruthy();
    expect(getByText('[EXPORT]')).toBeTruthy();
  });

  it('calls setAppMode when tab is clicked', async () => {
    const { getByText } = render(ModeSwitcher);
    
    await fireEvent.click(getByText('[EDIT]'));
    
    expect(setAppMode).toHaveBeenCalledWith('edit');
  });
});