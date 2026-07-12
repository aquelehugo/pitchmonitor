import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import scrollLastPitchIntoView from './scrollLastPitchIntoView'
import { getContext, setContext, type AppContext } from './appContext'

const baseContext = (): AppContext => ({
  pitchSize: { width: 5, height: 2 },
  pitches: [],
  pitchLines: {
    offset: { x: 70, y: 50 },
    baseDistance: 300,
    highestOnTop: true,
  },
  balloon: null,
})

const makeCanvas = (top: number, height: number = 1275): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  // jsdom doesn't lay out; stub getBoundingClientRect
  canvas.getBoundingClientRect = () =>
    ({
      top,
      bottom: top + height,
      left: 0,
      right: 0,
      width: 0,
      height,
      x: 0,
      y: top,
      toJSON: () => ({}),
    }) as DOMRect
  return canvas
}

describe('scrollLastPitchIntoView', () => {
  beforeEach(() => {
    setContext(baseContext())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does nothing when there are no pitches', () => {
    const canvas = makeCanvas(0)
    const scrollSpy = vi.spyOn(window, 'scrollTo')
    scrollLastPitchIntoView(canvas)(getContext())
    expect(scrollSpy).not.toHaveBeenCalled()
  })

  it('does not scroll when the last pitch is comfortably within the viewport', () => {
    // Canvas at top=0, height=1275, viewport height=600, scrollY=0
    // pitch at y=100 → docY=100, well within [16, 600-16]
    setContext({
      ...baseContext(),
      pitches: [{ color: 'green', y: 100 }],
    })
    Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })

    const canvas = makeCanvas(0)
    const scrollSpy = vi.spyOn(window, 'scrollTo')
    scrollLastPitchIntoView(canvas)(getContext())
    expect(scrollSpy).not.toHaveBeenCalled()
  })

  it('scrolls up (decreases scrollY) when pitch is too close to the top', () => {
    // Canvas at top=0, pitch at y=5 → docY=5, needs 16px padding
    // 5 < 0 + 16 → scroll up to 5 - 16 = -11
    setContext({
      ...baseContext(),
      pitches: [{ color: 'green', y: 5 }],
    })
    Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })

    const canvas = makeCanvas(0)
    const scrollSpy = vi.spyOn(window, 'scrollTo')
    scrollLastPitchIntoView(canvas)(getContext())
    expect(scrollSpy).toHaveBeenCalledTimes(1)
    const opts = scrollSpy.mock.calls[0][0] as ScrollToOptions
    expect(opts.top).toBe(-11) // 5 - 16
  })

  it('scrolls down (increases scrollY) when pitch is too close to the bottom', () => {
    // Canvas at top=0, height=1275, pitch at y=1200, height=2
    // docY=1200, docBottom=1202, viewport=600, scrollY=0
    // 1202 > 0 + 600 - 16 = 584 → scroll down to 1202 - 600 + 16 = 618
    setContext({
      ...baseContext(),
      pitches: [{ color: 'red', y: 1200 }],
    })
    Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })

    const canvas = makeCanvas(0)
    const scrollSpy = vi.spyOn(window, 'scrollTo')
    scrollLastPitchIntoView(canvas)(getContext())
    expect(scrollSpy).toHaveBeenCalledTimes(1)
    const opts = scrollSpy.mock.calls[0][0] as ScrollToOptions
    expect(opts.top).toBe(618) // 1202 - 600 + 16
  })

  it('only considers the LAST pitch in the array', () => {
    // Two pitches: first near the top (would trigger scroll up),
    // last comfortably in view. Should NOT scroll.
    setContext({
      ...baseContext(),
      pitches: [
        { color: 'green', y: 0 },
        { color: 'red', y: 300 },
      ],
    })
    Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })

    const canvas = makeCanvas(0)
    const scrollSpy = vi.spyOn(window, 'scrollTo')
    scrollLastPitchIntoView(canvas)(getContext())
    expect(scrollSpy).not.toHaveBeenCalled()
  })
})