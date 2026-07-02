export interface PitchSize {
  width: number
  height: number
}

export interface Pitch {
  color: string
  y: number
}

export interface PitchLinesOffset {
  x: number
  y: number
}

export interface PitchLines {
  offset: PitchLinesOffset
  baseDistance: number
  highestOnTop: boolean
}

export interface AppContext {
  pitchSize: PitchSize
  pitches: Pitch[]
  pitchLines: PitchLines
}

const DEFAULT_CONTEXT: AppContext = {
  pitchSize: {
    width: 5,
    height: 2,
  },
  pitches: [],
  pitchLines: {
    offset: {
      x: 70,
      y: 50,
    },
    baseDistance: 300,
    highestOnTop: true,
  },
}

const context: { value: AppContext } = { value: DEFAULT_CONTEXT }

export const setContext = (newContext: AppContext): void => {
  context.value = newContext
}

export const getContext = (): AppContext => context.value