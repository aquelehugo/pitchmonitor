import noteFrequencyTuples from '../constants/noteFrequencyTuples'
import type { AppContext } from './appContext'

const firstNoteFrequency = noteFrequencyTuples[0][1]
const lastNoteFrequency = noteFrequencyTuples.at(-1)![1]

const getLogPitchY =
  (frequency: number) =>
  (appContext: AppContext): number =>
    appContext.pitchLines.highestOnTop
      ? Math.log2(lastNoteFrequency) * appContext.pitchLines.baseDistance -
        Math.log2(frequency) * appContext.pitchLines.baseDistance +
        appContext.pitchLines.offset.y
      : Math.log2(frequency) * appContext.pitchLines.baseDistance -
        Math.log2(firstNoteFrequency) * appContext.pitchLines.baseDistance +
        appContext.pitchLines.offset.y

export default getLogPitchY