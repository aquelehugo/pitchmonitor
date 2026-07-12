import { describe, expect, it } from 'vitest'
import {
  createSmoothingState,
  smoothPitch,
  type SmoothingState,
} from './smoothPitch'

const FRAME = 0.023

describe('smoothPitch', () => {
  describe('first sample', () => {
    it('seeds exactly to the incoming pitch on the first detection', () => {
      const state = createSmoothingState(5, 0.3, 0.5)
      const { smoothedFrequency } = smoothPitch(440, 0, state)
      expect(smoothedFrequency).toBeCloseTo(440, 5)
    })
  })

  describe('median outlier rejection', () => {
    it('rejects a single octave-jump outlier among steady close-time tones', () => {
      let state = createSmoothingState(5, 1, 0.5)
      ;[0, 1, 2, 3].forEach(i => {
        state = smoothPitch(440, i * FRAME, state).state
      })
      const { smoothedFrequency } = smoothPitch(880, 4 * FRAME, state)
      expect(smoothedFrequency).toBeCloseTo(440, 5)
    })

    it('rejects a downward spike among steady close-time tones', () => {
      let state = createSmoothingState(5, 1, 0.5)
      ;[0, 1, 2, 3].forEach(i => {
        state = smoothPitch(440, i * FRAME, state).state
      })
      const { smoothedFrequency } = smoothPitch(110, 4 * FRAME, state)
      expect(smoothedFrequency).toBeCloseTo(440, 5)
    })
  })

  describe('time-based continuity gate', () => {
    it('smooths across a large leap when detections are close in time', () => {
      let state = createSmoothingState(5, 0.3, 0.5)
      state = smoothPitch(440, 0, state).state
      ;[1, 2, 3, 4].forEach(i => {
        state = smoothPitch(440, i * FRAME, state).state
      })
      const { smoothedFrequency } = smoothPitch(880, 5 * FRAME, state)
      expect(smoothedFrequency).toBeGreaterThan(440)
      expect(smoothedFrequency).toBeLessThan(880)
    })

    it('snaps after a silence gap exceeding the threshold (even for a close frequency)', () => {
      let state = createSmoothingState(5, 0.3, 0.5)
      ;[0, 1, 2, 3, 4].forEach(i => {
        state = smoothPitch(440, i * FRAME, state).state
      })
      const afterSilence = 4 * FRAME + 0.6
      const { smoothedFrequency, state: nextState } = smoothPitch(
        460,
        afterSilence,
        state,
      )
      expect(smoothedFrequency).toBeCloseTo(460, 5)
      expect(nextState.recentLogFreqs).toHaveLength(1)
      expect(nextState.recentLogFreqs[0]).toBeCloseTo(Math.log2(460), 5)
    })

    it('still smooths when the gap equals the threshold (boundary)', () => {
      let state = createSmoothingState(5, 0.3, 0.5)
      ;[0, 1, 2, 3, 4].forEach(i => {
        state = smoothPitch(440, i * FRAME, state).state
      })
      const boundary = 4 * FRAME + 0.5
      const { smoothedFrequency } = smoothPitch(460, boundary, state)
      expect(smoothedFrequency).toBeGreaterThan(440)
      expect(smoothedFrequency).toBeLessThan(460)
    })

    it('snaps after silence even for a distant frequency', () => {
      let state = createSmoothingState(5, 0.3, 0.5)
      ;[0, 1, 2, 3, 4].forEach(i => {
        state = smoothPitch(440, i * FRAME, state).state
      })
      const { smoothedFrequency } = smoothPitch(880, 4 * FRAME + 1.0, state)
      expect(smoothedFrequency).toBeCloseTo(880, 5)
    })

    it('clears the ring buffer on snap after silence', () => {
      let state = createSmoothingState(5, 0.3, 0.5)
      ;[0, 1, 2, 3, 4].forEach(i => {
        state = smoothPitch(440, i * FRAME, state).state
      })
      expect(state.recentLogFreqs).toHaveLength(5)
      const { state: nextState } = smoothPitch(440, 4 * FRAME + 0.7, state)
      expect(nextState.recentLogFreqs).toHaveLength(1)
    })
  })

  describe('EMA convergence', () => {
    it('converges toward a steady tone over repeated close-time samples', () => {
      let state = createSmoothingState(5, 0.3, 0.5)
      state = smoothPitch(220, 0, state).state
      let smoothed = 0
      for (let i = 1; i <= 50; i++) {
        const result = smoothPitch(440, i * FRAME, state)
        state = result.state
        smoothed = result.smoothedFrequency
      }
      expect(smoothed).toBeCloseTo(440, 2)
    })
  })

  describe('held note with small deviations', () => {
    it('smooths jitter around a held note without snapping', () => {
      let state = createSmoothingState(5, 0.3, 0.5)
      ;[0, 1, 2, 3, 4].forEach(i => {
        state = smoothPitch(440, i * FRAME, state).state
      })
      const deviations = [
        440,
        440 * Math.pow(2, 30 / 1200),
        440,
        440 * Math.pow(2, -30 / 1200),
        440,
      ]
      deviations.forEach((f, i) => {
        const result = smoothPitch(f, (5 + i) * FRAME, state)
        state = result.state
        const cents =
          (result.state.smoothedLogFreq! - Math.log2(440)) * 1200
        expect(Math.abs(cents)).toBeLessThan(50)
      })
    })
  })

  describe('ring buffer', () => {
    it('caps recentLogFreqs at windowSize', () => {
      let state = createSmoothingState(3, 0.5, 0.5)
      ;[100, 200, 300, 400, 500].forEach((f, i) => {
        state = smoothPitch(f, i * FRAME, state).state
      })
      expect(state.recentLogFreqs).toHaveLength(3)
    })
  })

  describe('immutability', () => {
    it('returns a new state object without mutating the input', () => {
      const state = createSmoothingState(5, 0.3, 0.5)
      const snapshot: SmoothingState = {
        recentLogFreqs: [...state.recentLogFreqs],
        smoothedLogFreq: state.smoothedLogFreq,
        windowSize: state.windowSize,
        alpha: state.alpha,
        lastDetectionTime: state.lastDetectionTime,
        silenceThresholdSeconds: state.silenceThresholdSeconds,
      }
      const { state: next } = smoothPitch(440, 0, state)
      expect(next).not.toBe(state)
      expect(state.recentLogFreqs).toEqual(snapshot.recentLogFreqs)
      expect(state.smoothedLogFreq).toBe(snapshot.smoothedLogFreq)
      expect(state.lastDetectionTime).toBe(snapshot.lastDetectionTime)
    })
  })

  describe('log-domain smoothing', () => {
    it('smooths linearly in cents, not hertz', () => {
      const stepCents = 40
      const alpha = 0.5
      let lowState = createSmoothingState(1, alpha, 0.5)
      let highState = createSmoothingState(1, alpha, 0.5)
      lowState = smoothPitch(220, 0, lowState).state
      highState = smoothPitch(440, 0, highState).state
      const lowTarget = 220 * Math.pow(2, stepCents / 1200)
      const highTarget = 440 * Math.pow(2, stepCents / 1200)
      const lowResult = smoothPitch(lowTarget, FRAME, lowState)
      const highResult = smoothPitch(highTarget, FRAME, highState)
      const lowCents =
        (Math.log2(lowResult.smoothedFrequency) - Math.log2(220)) * 1200
      const highCents =
        (Math.log2(highResult.smoothedFrequency) - Math.log2(440)) * 1200
      expect(lowCents).toBeCloseTo(highCents, 5)
      expect(lowCents).toBeCloseTo(stepCents * alpha, 5)
    })
  })
})