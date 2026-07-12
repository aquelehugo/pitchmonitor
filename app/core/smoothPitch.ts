export interface SmoothingState {
  recentLogFreqs: number[]
  smoothedLogFreq: number | null
  windowSize: number
  alpha: number
  lastDetectionTime: number | null
  silenceThresholdSeconds: number
}

export const createSmoothingState = (
  windowSize = 5,
  alpha = 0.3,
  silenceThresholdSeconds = 0.5,
): SmoothingState => ({
  recentLogFreqs: [],
  smoothedLogFreq: null,
  windowSize,
  alpha,
  lastDetectionTime: null,
  silenceThresholdSeconds,
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
  time: number,
  state: SmoothingState,
): SmoothResult => {
  const logFreq = Math.log2(frequency)

  const wasSilent =
    state.lastDetectionTime === null ||
    time - state.lastDetectionTime > state.silenceThresholdSeconds

  const recentLogFreqs = wasSilent ? [logFreq] : [...state.recentLogFreqs, logFreq]
  if (recentLogFreqs.length > state.windowSize) {
    recentLogFreqs.splice(
      0,
      recentLogFreqs.length - state.windowSize,
    )
  }

  const medianLogFreq = median(recentLogFreqs)

  let smoothedLogFreq: number

  if (wasSilent || state.smoothedLogFreq === null) {
    smoothedLogFreq = medianLogFreq
  } else {
    smoothedLogFreq =
      state.alpha * medianLogFreq +
      (1 - state.alpha) * state.smoothedLogFreq
  }

  const smoothedFrequency = Math.pow(2, smoothedLogFreq)

  return {
    smoothedFrequency,
    state: {
      ...state,
      recentLogFreqs,
      smoothedLogFreq,
      lastDetectionTime: time,
    },
  }
}