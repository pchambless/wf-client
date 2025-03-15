import { modalStore } from './modalStore';

describe('Modal Store', () => {
  it('should initialize with default state', () => {
    const store = modalStore();
    expect(store.isOpen).toBe(false);
    expect(store.content).toBeNull();
  });
});
