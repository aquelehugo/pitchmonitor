import type { AppContext } from './appContext'
import { getNoteDeviation } from './getNoteDeviation'

export interface Balloon {
  noteName: string
  cents: number | null
  x: number
  y: number
  opacity: number
  lastUpdate: number
}

const PERFECT_THRESHOLD = 10

export const balloonColor = (cents: number | null): string => {
  if (cents === null) return 'green'
  const absCents = Math.abs(cents)
  if (absCents <= PERFECT_THRESHOLD) return 'green'
  if (absCents <= 25) return 'orange'
  return 'red'
}

const FADE_DELAY = 500
const FADE_DURATION = 1500

export const showBalloon =
  (frequency: number, _canvasWidth: number, now: number) =>
  (appContext: AppContext): AppContext => {
    const { pitches, pitchSize, pitchLines } = appContext

    if (pitches.length === 0) {
      return appContext
    }

    const lastPitch = pitches[pitches.length - 1]
    const x = pitchLines.offset.x + (pitches.length - 1) * pitchSize.width
    const y = lastPitch.y + pitchSize.height / 2

    const { name, cents } = getNoteDeviation(frequency)

    const balloon: Balloon = {
      noteName: name,
      cents: Math.abs(cents) <= PERFECT_THRESHOLD ? null : cents,
      x,
      y,
      opacity: 1,
      lastUpdate: now,
    }

    return {
      ...appContext,
      balloon,
    }
  }

export const fadeBalloon =
  (now: number, fadeDelay = FADE_DELAY, fadeDuration = FADE_DURATION) =>
  (appContext: AppContext): AppContext => {
    const { balloon } = appContext

    if (!balloon) {
      return appContext
    }

    const elapsed = now - balloon.lastUpdate

    if (elapsed <= fadeDelay) {
      return appContext
    }

    const opacity = Math.max(0, 1 - (elapsed - fadeDelay) / fadeDuration)

    if (opacity === 0) {
      return {
        ...appContext,
        balloon: null,
      }
    }

    return {
      ...appContext,
      balloon: {
        ...balloon,
        opacity,
      },
    }
  }