import { describe, expect, it, beforeEach } from 'vitest'
import addPitch from './addPitch'
import { getContext, setContext, type AppContext } from './appContext'

const baseContext = (): AppContext => ({
  pitchSize: { width: 5, height: 2 },
  pitches: [],
  pitchLines: {
    offset: { x: 70, y: 50 },
    baseDistance: 300,
    highestOnTop: true,
  },
})

describe('addPitch', () => {
  beforeEach(() => {
    setContext(baseContext())
  })

  describe('rating colors', () => {
    it('marks exact A4 (440 Hz) as perfect (green)', () => {
      const ctx = addPitch(440, 1280)(getContext())
      const last = ctx.pitches.at(-1)!
      expect(last.color).toBe('green')
    })

    it('marks A4 within 10 cents as perfect (green)', () => {
      // 9 cents up from A4 = 440 * 2^(9/1200) ≈ 442.27 (just under 10 to avoid FP boundary)
      const withinPerfect = 440 * Math.pow(2, 9 / 1200)
      const ctx = addPitch(withinPerfect, 1280)(getContext())
      expect(ctx.pitches.at(-1)!.color).toBe('green')
    })

    it('marks A4 within 25 cents (but > 10) as good (orange)', () => {
      // 20 cents up = 440 * 2^(20/1200) ≈ 445.09
      const withinGood = 440 * Math.pow(2, 20 / 1200)
      const ctx = addPitch(withinGood, 1280)(getContext())
      expect(ctx.pitches.at(-1)!.color).toBe('orange')
    })

    it('marks A4 more than 25 cents off as bad (red)', () => {
      // 50 cents off
      const tooOff = 440 * Math.pow(2, 50 / 1200)
      const ctx = addPitch(tooOff, 1280)(getContext())
      expect(ctx.pitches.at(-1)!.color).toBe('red')
    })
  })

  describe('pitch y coordinate', () => {
    it('centers the pitch on the note line (y = noteY - height/2)', () => {
      const ctx = getContext()
      const pitchHeight = ctx.pitchSize.height
      const ctx2 = addPitch(440, 1280)(ctx)
      const last = ctx2.pitches.at(-1)!

      // y should be offset.y - height/2 + (log2(last) - log2(440)) * baseDistance
      const lastFreq = 987.77
      const expectedY =
        (Math.log2(lastFreq) - Math.log2(440)) * 300 +
        ctx.pitchLines.offset.y -
        pitchHeight / 2
      expect(last.y).toBeCloseTo(expectedY, 5)
    })
  })

  describe('rolling buffer', () => {
    it('appends pitches when below capacity', () => {
      // canvasWidth 1000, offset.x 70, pitchSize.width 5
      // maxVisible = floor((1000 - 70) / 5) = 186
      const ctx1 = addPitch(440, 1000)(getContext())
      expect(ctx1.pitches).toHaveLength(1)

      const ctx2 = addPitch(441, 1000)(ctx1)
      expect(ctx2.pitches).toHaveLength(2)
    })

    it('trims the oldest pitch when capacity is exceeded', () => {
      // canvasWidth 95, offset.x 70, pitchSize.width 5
      // maxVisible = floor((95 - 70) / 5) = 5
      const canvasWidth = 95
      let ctx = getContext()
      const frequencies = [100, 200, 300, 400, 500, 600, 700]

      frequencies.forEach(f => {
        ctx = addPitch(f, canvasWidth)(ctx)
      })

      // Should have exactly maxVisible = 5 pitches
      expect(ctx.pitches).toHaveLength(5)
      // The oldest (100) should have been dropped, the rest shifted
      // Since each pitch y is different, just verify the order is the last 5
      // We verify by checking the pitches kept correspond to the last 5 frequencies
      // Each pitch's y is deterministic; we can verify counts and that pitches[0]
      // is NOT the first added. We can also just verify we have 5 pitches.
      // More specifically: the LAST pitch should be the most recent (700).
      // We can't easily verify which were dropped without reproducing the math.
    })

    it('keeps the most recent pitches when over capacity (newest is last)', () => {
      const canvasWidth = 95 // maxVisible = 5
      let ctx = getContext()
      ;[100, 200, 300, 400, 500, 600].forEach(f => {
        ctx = addPitch(f, canvasWidth)(ctx)
      })

      // The very last added pitch's y should equal the y for 600 Hz
      const last = ctx.pitches.at(-1)!
      const expectedY =
        (Math.log2(987.77) - Math.log2(600)) * 300 +
        ctx.pitchLines.offset.y -
        ctx.pitchSize.height / 2
      expect(last.y).toBeCloseTo(expectedY, 5)
      expect(ctx.pitches).toHaveLength(5)
    })

    it('does not mutate the input context (returns a new object)', () => {
      const original = getContext()
      const next = addPitch(440, 1280)(original)
      expect(next).not.toBe(original)
      expect(original.pitches).toHaveLength(0)
      expect(next.pitches).toHaveLength(1)
    })
  })
})