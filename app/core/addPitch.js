import noteFrequencyTuples from '../constants/noteFrequencyTuples'
import getLogPitchY from './getLogPitchY'

const getPitchRating = frequency =>
  noteFrequencyTuples.reduce((rating, noteFrequencyTuple) => {
    const [_, expectedFrequency] = noteFrequencyTuple
    // Calculate deviation in cents: C = 1200 * log2(f / f_0)
    const ratio = frequency / expectedFrequency
    const absoluteDeviationCents = Math.abs(1200 * Math.log2(ratio))

    if (absoluteDeviationCents <= 10) {
      return 'perfect'
    }

    if (absoluteDeviationCents <= 25) {
      return 'good'
    }

    return rating
  }, 'bad')

const COLORS_BY_RATING = {
  perfect: 'green',
  good: 'orange',
  bad: 'red',
}

const addPitch = (frequency, canvasWidth) => appContext => {
  const { pitches, pitchSize, pitchLines } = appContext
  const rating = getPitchRating(frequency)
  const y = getLogPitchY(frequency)(appContext) - pitchSize.height / 2

  const nextPitches = [...pitches, { color: COLORS_BY_RATING[rating], y }]

  const maxVisible = Math.floor(
    (canvasWidth - pitchLines.offset.x) / pitchSize.width,
  )

  return {
    ...appContext,
    pitches:
      nextPitches.length > maxVisible
        ? nextPitches.slice(nextPitches.length - maxVisible)
        : nextPitches,
  }
}

export default addPitch