const PADDING = 16

const scrollLastPitchIntoView = canvasElement => appContext => {
  const { pitches, pitchSize } = appContext
  if (pitches.length === 0) return

  const lastPitch = pitches.at(-1)
  const rect = canvasElement.getBoundingClientRect()

  const noteTopDocY = rect.top + window.scrollY + lastPitch.y
  const noteBottomDocY = noteTopDocY + pitchSize.height

  const viewportTop = window.scrollY
  const viewportBottom = viewportTop + window.innerHeight

  let targetScrollY = viewportTop
  if (noteTopDocY < viewportTop + PADDING) {
    targetScrollY = noteTopDocY - PADDING
  } else if (noteBottomDocY > viewportBottom - PADDING) {
    targetScrollY = noteBottomDocY - window.innerHeight + PADDING
  }

  if (targetScrollY !== viewportTop) {
    window.scrollTo({ left: window.scrollX, top: targetScrollY, behavior: 'auto' })
  }
}

export default scrollLastPitchIntoView