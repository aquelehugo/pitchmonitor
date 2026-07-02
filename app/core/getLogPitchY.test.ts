import { describe, expect, it } from 'vitest'
import getLogPitchY from './getLogPitchY'
import { getContext } from './appContext'
import noteFrequencyTuples from '../constants/noteFrequencyTuples'

describe('getLogPitchY', () => {
  const firstFreq = noteFrequencyTuples[0][1] // C2 ~65.41
  const lastFreq = noteFrequencyTuples.at(-1)![1] // B5 ~987.77

  it('places the highest note at the top (smallest y) when highestOnTop is true', () => {
    const ctx = getContext()
    const yHighest = getLogPitchY(lastFreq)(ctx)
    const yLowest = getLogPitchY(firstFreq)(ctx)
    expect(yHighest).toBeLessThan(yLowest)
  })

  it('places the highest note at offset.y when highestOnTop is true', () => {
    const ctx = getContext()
    const y = getLogPitchY(lastFreq)(ctx)
    expect(y).toBeCloseTo(ctx.pitchLines.offset.y, 5)
  })

  it('places the lowest note at offset.y when highestOnTop is false', () => {
    const ctx = { ...getContext(), pitchLines: { ...getContext().pitchLines, highestOnTop: false } }
    const y = getLogPitchY(firstFreq)(ctx)
    expect(y).toBeCloseTo(ctx.pitchLines.offset.y, 5)
  })

  it('y range spans (log2(last) - log2(first)) * baseDistance + offset.y when highestOnTop is true', () => {
    const ctx = getContext()
    const { baseDistance } = ctx.pitchLines
    const expectedRange =
      (Math.log2(lastFreq) - Math.log2(firstFreq)) * baseDistance
    const actualRange = getLogPitchY(firstFreq)(ctx) - getLogPitchY(lastFreq)(ctx)
    expect(actualRange).toBeCloseTo(expectedRange, 5)
  })

  it('higher frequencies always produce smaller y values when highestOnTop is true', () => {
    const ctx = getContext()
    const a4 = 440
    const a5 = 880
    expect(getLogPitchY(a5)(ctx)).toBeLessThan(getLogPitchY(a4)(ctx))
  })
})