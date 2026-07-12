import { describe, expect, it, beforeEach } from 'vitest'
import { showBalloon, fadeBalloon, balloonColor, type Balloon } from './balloon'
import { getContext, setContext, type AppContext } from './appContext'

const baseContext = (): AppContext => ({
  pitchSize: { width: 5, height: 2 },
  pitches: [],
  pitchLines: {
    offset: { x: 70, y: 50 },
    baseDistance: 300,
    highestOnTop: true,
  },
  balloon: null,
})

describe('balloonColor', () => {
  it('returns green for perfect (cents = null)', () => {
    expect(balloonColor(null)).toBe('green')
  })

  it('returns green for within 10 cents', () => {
    expect(balloonColor(5)).toBe('green')
    expect(balloonColor(-8)).toBe('green')
  })

  it('returns orange for within 25 cents', () => {
    expect(balloonColor(15)).toBe('orange')
    expect(balloonColor(-20)).toBe('orange')
  })

  it('returns red for > 25 cents', () => {
    expect(balloonColor(30)).toBe('red')
    expect(balloonColor(-50)).toBe('red')
  })
})

describe('showBalloon', () => {
  beforeEach(() => {
    setContext(baseContext())
  })

  it('does nothing when there are no pitches', () => {
    const ctx = baseContext()
    const next = showBalloon(440, 1280, 0)(ctx)
    expect(next).toBe(ctx)
  })

  it('sets balloon with note info and coordinates', () => {
    const ctx: AppContext = {
      ...baseContext(),
      pitches: [{ color: 'green', y: 100 }],
    }
    setContext(ctx)
    const next = showBalloon(440, 1280, 1000)(getContext())
    expect(next.balloon).not.toBeNull()
    expect(next.balloon!.noteName).toBe('A4')
    expect(next.balloon!.cents).toBeNull()
    expect(next.balloon!.x).toBe(70)
    expect(next.balloon!.y).toBe(101)
    expect(next.balloon!.opacity).toBe(1)
    expect(next.balloon!.lastUpdate).toBe(1000)
  })

  it('sets cents to null when pitch is perfect', () => {
    const ctx: AppContext = {
      ...baseContext(),
      pitches: [{ color: 'green', y: 100 }],
    }
    setContext(ctx)
    const next = showBalloon(440, 1280, 0)(getContext())
    expect(next.balloon!.cents).toBeNull()
  })

  it('sets signed cents when pitch is not perfect', () => {
    const ctx: AppContext = {
      ...baseContext(),
      pitches: [{ color: 'green', y: 100 }],
    }
    setContext(ctx)
    const sharp = 440 * Math.pow(2, 35 / 1200)
    const next = showBalloon(sharp, 1280, 0)(getContext())
    expect(next.balloon!.cents).toBe(35)
  })

  it('calculates x position based on pitch index', () => {
    const ctx: AppContext = {
      ...baseContext(),
      pitches: [
        { color: 'green', y: 100 },
        { color: 'green', y: 100 },
      ],
    }
    setContext(ctx)
    const next = showBalloon(440, 1280, 0)(getContext())
    expect(next.balloon!.x).toBe(70 + 5)
  })
})

describe('fadeBalloon', () => {
  beforeEach(() => {
    setContext(baseContext())
  })

  it('does nothing when balloon is null', () => {
    const ctx = { ...baseContext(), balloon: null }
    const next = fadeBalloon(1)(ctx)
    expect(next).toBe(ctx)
  })

  it('keeps opacity 1 when within fade delay', () => {
    const balloon: Balloon = {
      noteName: 'A4',
      cents: null,
      x: 70,
      y: 100,
      opacity: 1,
      lastUpdate: 1000,
    }
    const ctx = { ...baseContext(), balloon }
    const next = fadeBalloon(1300)(ctx)
    expect(next.balloon!.opacity).toBe(1)
  })

  it('fades linearly after fade delay', () => {
    const balloon: Balloon = {
      noteName: 'A4',
      cents: null,
      x: 70,
      y: 100,
      opacity: 1,
      lastUpdate: 1000,
    }
    const ctx = { ...baseContext(), balloon }
    const next = fadeBalloon(2250)(ctx)
    expect(next.balloon!.opacity).toBeCloseTo(0.5, 5)
  })

  it('sets balloon to null when fully faded', () => {
    const balloon: Balloon = {
      noteName: 'A4',
      cents: null,
      x: 70,
      y: 100,
      opacity: 1,
      lastUpdate: 1000,
    }
    const ctx = { ...baseContext(), balloon }
    const next = fadeBalloon(4000)(ctx)
    expect(next.balloon).toBeNull()
  })

  it('does not mutate the input context', () => {
    const balloon: Balloon = {
      noteName: 'A4',
      cents: null,
      x: 70,
      y: 100,
      opacity: 1,
      lastUpdate: 1000,
    }
    const ctx: AppContext = { ...baseContext(), balloon }
    const snapshot = { ...ctx, balloon: { ...balloon } }
    fadeBalloon(1500)(ctx)
    expect(ctx.balloon).toEqual(snapshot.balloon)
  })
})