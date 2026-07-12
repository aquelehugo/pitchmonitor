import { describe, expect, it } from 'vitest'
import { getNoteDeviation } from './getNoteDeviation'

describe('getNoteDeviation', () => {
  it('returns A4 with 0 cents for exactly 440 Hz', () => {
    const result = getNoteDeviation(440)
    expect(result.name).toBe('A4')
    expect(result.cents).toBe(0)
  })

  it('returns A4 with positive cents for sharp pitch', () => {
    const sharp = 440 * Math.pow(2, 35 / 1200)
    const result = getNoteDeviation(sharp)
    expect(result.name).toBe('A4')
    expect(result.cents).toBe(35)
  })

  it('returns A4 with negative cents for flat pitch', () => {
    const flat = 440 * Math.pow(2, -12 / 1200)
    const result = getNoteDeviation(flat)
    expect(result.name).toBe('A4')
    expect(result.cents).toBe(-12)
  })

  it('picks the nearest note', () => {
    const result = getNoteDeviation(466.16)
    expect(result.name).toBe('A#4')
  })

  it('uses the first note name when there are alternatives', () => {
    const result = getNoteDeviation(466.16)
    expect(result.name).toBe('A#4')
  })

  it('works at the low end (C2 boundary)', () => {
    const result = getNoteDeviation(65.41)
    expect(result.name).toBe('C2')
    expect(result.cents).toBe(0)
  })

  it('rounds cents to the nearest integer', () => {
    const slightlySharp = 440 * Math.pow(2, 5.7 / 1200)
    const result = getNoteDeviation(slightlySharp)
    expect(result.cents).toBe(6)
  })
})