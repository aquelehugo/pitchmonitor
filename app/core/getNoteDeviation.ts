import noteFrequencyTuples from '../constants/noteFrequencyTuples'

export interface NoteDeviation {
  name: string
  cents: number
}

export const getNoteDeviation = (frequency: number): NoteDeviation => {
  let minAbsDeviation = Infinity
  let nearestNote = noteFrequencyTuples[0]

  for (const noteFrequencyTuple of noteFrequencyTuples) {
    const expectedFrequency = noteFrequencyTuple[1]
    const ratio = frequency / expectedFrequency
    const deviationCents = 1200 * Math.log2(ratio)
    const absDeviation = Math.abs(deviationCents)

    if (absDeviation < minAbsDeviation) {
      minAbsDeviation = absDeviation
      nearestNote = noteFrequencyTuple
    }
  }

  const expectedFrequency = nearestNote[1]
  const ratio = frequency / expectedFrequency
  const deviationCents = 1200 * Math.log2(ratio)

  const noteName = nearestNote[0].split('/')[0]

  return {
    name: noteName,
    cents: Math.round(deviationCents),
  }
}