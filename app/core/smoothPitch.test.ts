import { describe, expect, it } from 'vitest'
import {
  createSmoothingState,
  smoothPitch,
  type SmoothingState,
} from './smoothPitch'

describe('smoothPitch', () => {
  describe('first sample', () => {
    it('passes through (smoothed equals input) on the first sample', () => {
      const state = createSmoothingState(5, 0.3)
      const { smoothedFrequency } = smoothPitch(440, state)
      expect(smoothedFrequency).toBeCloseTo(440, 5)
    })
  })

  describe('median outlier rejection', () => {
    it('rejects a single octave-jump outlier among steady tones', () => {
      let state = createSmoothingState(5, 1)
      ;[440, 440, 440, 440].forEach(f => {
        state = smoothPitch(f, state).state
      })
      const { smoothedFrequency } = smoothPitch(880, state)
      expect(smoothedFrequency).toBeCloseTo(440, 5)
    })

    it('rejects a downward spike among steady tones', () => {
      let state = createSmoothingState(5, 1)
      ;[440, 440, 440, 440].forEach(f => {
        state = smoothPitch(f, state).state
      })
      const { smoothedFrequency } = smoothPitch(110, state)
      expect(smoothedFrequency).toBeCloseTo(440, 5)
    })
  })

  describe('EMA convergence', () => {
    it('converges toward a steady tone over repeated samples', () => {
      let state = createSmoothingState(5, 0.3)
      state = smoothPitch(220, state).state
      let smoothed = 0
      for (let i = 0; i < 50; i++) {
        const result = smoothPitch(440, state)
        state = result.state
        smoothed = result.smoothedFrequency
      }
      expect(smoothed).toBeCloseTo(440, 2)
    })
  })

  describe('jump gate', () => {
    it('snaps instantly to the new note once the median confirms it', () => {
      let state = createSmoothingState(5, 0.3)
      ;[440, 440, 440, 440, 440].forEach(f => {
        state = smoothPitch(f, state).state
      })
      expect(state.smoothedLogFreq).toBeCloseTo(Math.log2(440), 5)

      let result = smoothPitch(880, state)
      state = result.state
      expect(result.smoothedFrequency).toBeCloseTo(440, 5)

      result = smoothPitch(880, state)
      state = result.state
      expect(result.smoothedFrequency).toBeCloseTo(440, 5)

      result = smoothPitch(880, state)
      expect(result.smoothedFrequency).toBeCloseTo(880, 5)
    })

    it('does not slide through intermediate frequencies on a note change', () => {
      let state = createSmoothingState(5, 0.3)
      ;[440, 440, 440, 440, 440].forEach(f => {
        state = smoothPitch(f, state).state
      })
      ;[880, 880, 880, 880, 880].forEach(f => {
        const { smoothedFrequency } = smoothPitch(f, state)
        state = smoothPitch(f, state).state
        const isAtOldNote =
          Math.abs(smoothedFrequency - 440) < 1
        const isAtNewNote =
          Math.abs(smoothedFrequency - 880) < 1
        expect(isAtOldNote || isAtNewNote).toBe(true)
      })
    })

    it('smooths small deviations around a held note without snapping', () => {
      let state = createSmoothingState(5, 0.3)
      ;[440, 440, 440, 440, 440].forEach(f => {
        state = smoothPitch(f, state).state
      })
      const deviations = [440, 440 * Math.pow(2, 30 / 1200), 440, 440 * Math.pow(2, -30 / 1200), 440]
      deviations.forEach(f => {
        const result = smoothPitch(f, state)
        state = result.state
        const cents =
          (result.state.smoothedLogFreq! - Math.log2(440)) * 1200
        expect(Math.abs(cents)).toBeLessThan(50)
      })
    })

    it('refills the ring buffer on snap so a single stale sample cannot snap back', () => {
      let state = createSmoothingState(5, 0.3)
      ;[220, 220, 220, 220, 220].forEach(f => {
        state = smoothPitch(f, state).state
      })
      ;[440, 440, 440].forEach(f => {
        state = smoothPitch(f, state).state
      })
      expect(state.smoothedLogFreq).toBeCloseTo(Math.log2(440), 5)
      expect(state.recentLogFreqs.every(v => v === Math.log2(440))).toBe(true)

      const { smoothedFrequency } = smoothPitch(220, state)
      expect(smoothedFrequency).toBeCloseTo(440, 5)
    })

    it('snaps on a 60-cent jump', () => {
      let state = createSmoothingState(1, 0.3)
      state = smoothPitch(440, state).state
      const target = 440 * Math.pow(2, 60 / 1200)
      const { smoothedFrequency } = smoothPitch(target, state)
      expect(smoothedFrequency).toBeCloseTo(target, 5)
    })

    it('smooths (does not snap) on a 40-cent jump', () => {
      let state = createSmoothingState(1, 0.3)
      state = smoothPitch(440, state).state
      const target = 440 * Math.pow(2, 40 / 1200)
      const { smoothedFrequency } = smoothPitch(target, state)
      expect(smoothedFrequency).toBeGreaterThan(440)
      expect(smoothedFrequency).toBeLessThan(target)
    })
  })

  describe('ring buffer', () => {
    it('caps recentLogFreqs at windowSize', () => {
      let state = createSmoothingState(3, 0.5)
      ;[100, 200, 300, 400, 500].forEach(f => {
        state = smoothPitch(f, state).state
      })
      expect(state.recentLogFreqs).toHaveLength(3)
    })
  })

  describe('immutability', () => {
    it('returns a new state object without mutating the input', () => {
      const state = createSmoothingState(5, 0.3)
      const snapshot: SmoothingState = {
        recentLogFreqs: [...state.recentLogFreqs],
        smoothedLogFreq: state.smoothedLogFreq,
        windowSize: state.windowSize,
        alpha: state.alpha,
        jumpThresholdCents: state.jumpThresholdCents,
      }
      const { state: next } = smoothPitch(440, state)
      expect(next).not.toBe(state)
      expect(state.recentLogFreqs).toEqual(snapshot.recentLogFreqs)
      expect(state.smoothedLogFreq).toBe(snapshot.smoothedLogFreq)
    })
  })

  describe('log-domain smoothing', () => {
    it('smooths linearly in cents, not hertz', () => {
      const stepCents = 40
      const alpha = 0.5
      let lowState = createSmoothingState(1, alpha)
      let highState = createSmoothingState(1, alpha)
      lowState = smoothPitch(220, lowState).state
      highState = smoothPitch(440, highState).state
      const lowTarget = 220 * Math.pow(2, stepCents / 1200)
      const highTarget = 440 * Math.pow(2, stepCents / 1200)
      const lowResult = smoothPitch(lowTarget, lowState)
      const highResult = smoothPitch(highTarget, highState)
      const lowCents =
        (Math.log2(lowResult.smoothedFrequency) - Math.log2(220)) * 1200
      const highCents =
        (Math.log2(highResult.smoothedFrequency) - Math.log2(440)) * 1200
      expect(lowCents).toBeCloseTo(highCents, 5)
      expect(lowCents).toBeCloseTo(stepCents * alpha, 5)
    })
  })
})