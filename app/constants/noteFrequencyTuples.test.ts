import { describe, expect, it } from 'vitest'
import noteFrequencyTuples from './noteFrequencyTuples'

describe('noteFrequencyTuples', () => {
  it('contains at least 48 notes', () => {
    expect(noteFrequencyTuples.length).toBeGreaterThanOrEqual(48)
  })

  it('has [name, frequency] tuples in ascending order', () => {
    noteFrequencyTuples.forEach(tuple => {
      expect(tuple).toHaveLength(2)
      expect(typeof tuple[0]).toBe('string')
      expect(typeof tuple[1]).toBe('number')
    })

    const frequencies = noteFrequencyTuples.map(t => t[1])
    const sorted = [...frequencies].sort((a, b) => a - b)
    expect(frequencies).toEqual(sorted)
  })

  it('starts at C2 (~65.41 Hz) and ends at B5 (~987.77 Hz)', () => {
    expect(noteFrequencyTuples[0][0]).toBe('C2')
    expect(noteFrequencyTuples[0][1]).toBeCloseTo(65.41, 2)
    expect(noteFrequencyTuples.at(-1)![0]).toBe('B5')
    expect(noteFrequencyTuples.at(-1)![1]).toBeCloseTo(987.77, 2)
  })

  it('A4 is the standard 440 Hz reference', () => {
    const a4 = noteFrequencyTuples.find(t => t[0] === 'A4')
    expect(a4).toBeDefined()
    expect(a4![1]).toBe(440.0)
  })
})