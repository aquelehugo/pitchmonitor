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

const updateLastPitch = (frequency, canvasWidth) => appContext => {
  const { lastPitch, pitchSize, pitchLines } = appContext
  const newPitchX =
    lastPitch.position.x < pitchLines.offset.x
      ? pitchLines.offset.x
      : lastPitch.position.x + pitchSize.width

  const rating = getPitchRating(frequency)

  return {
    ...appContext,
    lastPitch: {
      position: {
        x: newPitchX > canvasWidth ? pitchLines.offset.x : newPitchX,
        y: getLogPitchY(frequency)(appContext) - pitchSize.height / 2,
      },
      color: COLORS_BY_RATING[rating],
    },
  }
}

export default updateLastPitch
