import noteFrequencyTuples from '../constants/noteFrequencyTuples'

const [firstNoteTuple] = noteFrequencyTuples
const [_, firstNoteFrequency] = firstNoteTuple

const getLogPitchY = frequency => appContext =>
  Math.log2(frequency) * appContext.pitchLines.baseDistance -
  Math.log2(firstNoteFrequency) * appContext.pitchLines.baseDistance +
  appContext.pitchLines.offset.y

export default getLogPitchY
