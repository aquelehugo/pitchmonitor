export interface SmoothingState {
  recentLogFreqs: number[]
  smoothedLogFreq: number | null
  windowSize: number
  alpha: number
  jumpThresholdCents: number
}

export const createSmoothingState = (
  windowSize = 5,
  alpha = 0.3,
  jumpThresholdCents = 100,
): SmoothingState => ({
  recentLogFreqs: [],
  smoothedLogFreq: null,
  windowSize,
  alpha,
  jumpThresholdCents,
})

const median = (values: number[]): number => {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

export interface SmoothResult {
  smoothedFrequency: number
  state: SmoothingState
}

export const smoothPitch = (
  frequency: number,
  state: SmoothingState,
): SmoothResult => {
  const logFreq = Math.log2(frequency)

  const recentLogFreqs = [...state.recentLogFreqs, logFreq]
  if (recentLogFreqs.length > state.windowSize) {
    recentLogFreqs.splice(
      0,
      recentLogFreqs.length - state.windowSize,
    )
  }

  const medianLogFreq = median(recentLogFreqs)

  let smoothedLogFreq: number
  let snappedLogFreqs: number[] | undefined

  if (state.smoothedLogFreq === null) {
    smoothedLogFreq = medianLogFreq
  } else {
    const deltaCents =
      (medianLogFreq - state.smoothedLogFreq) * 1200

    if (Math.abs(deltaCents) > state.jumpThresholdCents) {
      smoothedLogFreq = medianLogFreq
      snappedLogFreqs = new Array(state.windowSize).fill(medianLogFreq)
    } else {
      smoothedLogFreq =
        state.alpha * medianLogFreq +
        (1 - state.alpha) * state.smoothedLogFreq
    }
  }

  const smoothedFrequency = Math.pow(2, smoothedLogFreq)

  return {
    smoothedFrequency,
    state: {
      ...state,
      recentLogFreqs: snappedLogFreqs ?? recentLogFreqs,
      smoothedLogFreq,
    },
  }
}
