import { describe, expect, it, beforeEach } from 'vitest'
import { getContext, setContext, type AppContext } from './appContext'

describe('appContext', () => {
  beforeEach(() => {
    setContext({
      pitchSize: { width: 5, height: 2 },
      pitches: [],
      pitchLines: {
        offset: { x: 70, y: 50 },
        baseDistance: 300,
        highestOnTop: true,
      },
    })
  })

  it('returns a default context with the expected shape', () => {
    const ctx = getContext()
    expect(ctx).toMatchObject({
      pitchSize: { width: 5, height: 2 },
      pitches: [],
    })
    expect(ctx.pitchLines.offset).toEqual({ x: 70, y: 50 })
    expect(ctx.pitchLines.baseDistance).toBe(300)
    expect(ctx.pitchLines.highestOnTop).toBe(true)
  })

  it('setContext replaces the current context', () => {
    const newCtx: AppContext = {
      pitchSize: { width: 10, height: 4 },
      pitches: [{ color: 'green', y: 100 }],
      pitchLines: {
        offset: { x: 0, y: 0 },
        baseDistance: 200,
        highestOnTop: false,
      },
    }
    setContext(newCtx)
    expect(getContext()).toEqual(newCtx)
  })
})