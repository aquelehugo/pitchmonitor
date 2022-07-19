import noteFrequencyTuples from '../constants/noteFrequencyTuples'
import getLogPitchY from './getLogPitchY'

const isNearNote = frequency =>
  noteFrequencyTuples.some(noteFrequencyTuple => {
    const [_, expectedFrequency] = noteFrequencyTuple
    const frequencyDiff = Math.abs(expectedFrequency - frequency)
    return frequencyDiff <= 0.01 * expectedFrequency
  })

const updateLastPitch = (frequency, canvasWidth) => appContext => {
  const { lastPitch, pitchSize, pitchLines } = appContext
  const newPitchX =
    lastPitch.position.x < pitchLines.offset.x
      ? pitchLines.offset.x
      : lastPitch.position.x + pitchSize.width

  return {
    ...appContext,
    lastPitch: {
      position: {
        x: newPitchX > canvasWidth ? pitchLines.offset.x : newPitchX,
        y: getLogPitchY(frequency)(appContext) - pitchSize.height / 2,
      },
      color: isNearNote(frequency) ? 'green' : 'red',
    },
  }
}

export default updateLastPitch
