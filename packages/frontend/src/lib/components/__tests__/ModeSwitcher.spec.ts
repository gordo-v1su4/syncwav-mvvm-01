import { render, fireEvent } from '@testing-library/svelte/svelte5';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ModeSwitcher from '../ModeSwitcher.svelte';
import type { UIState } from '$lib/types';

// Mock the store and its functions
import * as uiStoreModule from '$lib/stores/uiStore';
vi.mock('$lib/stores/uiStore', () => {
  return {
    uiStore: {
      subscribe: (run: any) => {
        run({ currentAppMode: 'setup' });
        return () => {};
      }
    },
    setAppMode: vi.fn()
  };
});

describe('ModeSwitcher', () => {
  it('renders without crashing', () => {
    const { container } = render(ModeSwitcher);
    expect(container).toBeTruthy();
  });
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
    
    expect(vi.mocked(uiStoreModule).setAppMode).toHaveBeenCalledWith('edit');
  });
});