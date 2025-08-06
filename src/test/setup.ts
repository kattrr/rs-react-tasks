import '@testing-library/jest-dom';

if (!globalThis.localStorage) {
  const localStorageMock = (() => {
    let store: Record<string, string | undefined> = {};
    return {
      getItem(key: string) {
        return store[key] ?? null;
      },
      setItem(key: string, value: string) {
        store[key] = value;
      },
      removeItem(key: string) {
        store[key] = undefined;
      },
      clear() {
        store = {};
      },
    };
  })();

  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
}
