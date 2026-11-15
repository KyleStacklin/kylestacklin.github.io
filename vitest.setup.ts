import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Node >= 22 defines its own experimental global `localStorage`/`sessionStorage`
// (undefined unless --localstorage-file is passed). Vitest's jsdom environment
// skips any jsdom window key that already exists on the Node global, so jsdom's
// storage implementations never get exposed. Re-expose them here.
const jsdomWindow = (globalThis as unknown as { jsdom?: { window?: Window & typeof globalThis } })
  .jsdom?.window
if (jsdomWindow) {
  ;(['localStorage', 'sessionStorage'] as const).forEach((storageName) => {
    if (typeof jsdomWindow[storageName] !== 'undefined') {
      Object.defineProperty(globalThis, storageName, {
        configurable: true,
        enumerable: true,
        get: () => jsdomWindow[storageName],
      })
    }
  })
}

// Components use CRA/webpack-style dynamic image requires, e.g.
// require(`./ror2_items_img/${nickname}.webp`), which don't exist in vitest's
// ESM runtime. Stub a pass-through so tile/list rendering works in tests.
vi.stubGlobal('require', (path: string) => path)

// mobx-react-lite's useSyncExternalStore reactions and jsdom's async hashchange
// fire store/router updates outside act() scopes. The updates are synchronous
// and fully flushed before assertions, so the React 18 act() warning is noise
// here. Filter only that message; keep every other console.error audible.
const originalConsoleError = console.error.bind(console)
console.error = (...args: unknown[]) => {
  const first = args[0]
  if (typeof first === 'string' && first.includes('not wrapped in act')) return
  originalConsoleError(...args)
}
