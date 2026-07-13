import './style.css'
import noteFrequencyTuples from './constants/noteFrequencyTuples'
import { setupPitchDetector } from './audio/pitchDetector'
import getLogPitchY from './core/getLogPitchY'
import { getContext, setContext, type AppContext } from './core/appContext'
import addPitch from './core/addPitch'
import scrollLastPitchIntoView from './core/scrollLastPitchIntoView'
import { showBalloon, fadeBalloon, balloonColor } from './core/balloon'
import logoUrl from '../public/pitchmonitor.svg'

document.querySelector('#app')!.innerHTML = `
  <div class="header">
    <h1>Pitch Monitor <img src="${logoUrl}" height="48" width="48"></h1>
    <div>last pitch: <span id="pitch">N/A</span></div>
  </div>
  <canvas />
`

const canvas = document.querySelector('canvas')!
const canvasContext = canvas.getContext('2d')!

// Calculate height needed to show all notes
const firstNoteFrequency = noteFrequencyTuples[0][1]
const lastNoteFrequency = noteFrequencyTuples.at(-1)![1]
const { baseDistance, offset } = getContext().pitchLines
const requiredHeight =
  Math.log2(lastNoteFrequency) * baseDistance -
  Math.log2(firstNoteFrequency) * baseDistance +
  offset.y +
  50 // padding

const dpr = window.devicePixelRatio || 1

const resizeCanvas = () => {
  const rect = canvas.getBoundingClientRect()
  canvas.width = Math.round(rect.width * dpr)
  canvas.height = Math.round(requiredHeight * dpr)
  canvas.style.height = requiredHeight + 'px'
  canvasContext.setTransform(dpr, 0, 0, dpr, 0, 0)
  paintMonitorBoard(getContext())
  paintPitches(getContext())
}
window.addEventListener('resize', resizeCanvas)

const paintNotesLines = (appContext: AppContext) => {
  canvasContext.font = 'bold 10px sans-serif'
  canvasContext.textAlign = 'left'
  canvasContext.textBaseline = 'alphabetic'

  const cssWidth = canvas.getBoundingClientRect().width
  const { offset } = appContext.pitchLines

  noteFrequencyTuples.forEach((noteFrequencyTuple, index) => {
    const [note, frequency] = noteFrequencyTuple
    const pitchY = getLogPitchY(frequency)(appContext)

    const prevNote = noteFrequencyTuples[index - 1]
    const nextNote = noteFrequencyTuples[index + 1]
    const prevY = prevNote ? getLogPitchY(prevNote[1])(appContext) : requiredHeight
    const nextY = nextNote ? getLogPitchY(nextNote[1])(appContext) : 0

    const top = (pitchY + nextY) / 2
    const bottom = (pitchY + prevY) / 2
    const height = bottom - top

    const isAccidental = note.includes('#') || note.includes('/b')
    if (isAccidental) {
      canvasContext.fillStyle = '#ebebff'
      canvasContext.fillRect(offset.x, top, cssWidth - offset.x, height)
    }

    canvasContext.fillStyle = 'blue'
    canvasContext.fillText(note, 8, pitchY)
    canvasContext.fillStyle = '#9999cc'
    canvasContext.fillRect(offset.x, pitchY, cssWidth, 1)
  })
}

const paintMonitorBoard = (appContext: AppContext) => {
  const cssWidth = canvas.getBoundingClientRect().width
  canvasContext.fillStyle = 'white'
  canvasContext.fillRect(0, 0, cssWidth, requiredHeight)
  paintNotesLines(appContext)
}

const paintPitches = (appContext: AppContext) => {
  const { pitches, pitchSize, pitchLines } = appContext

  paintMonitorBoard(appContext)

  pitches.forEach((pitch, index) => {
    canvasContext.fillStyle = pitch.color
    canvasContext.fillRect(
      pitchLines.offset.x + index * pitchSize.width,
      pitch.y,
      pitchSize.width,
      pitchSize.height,
    )
  })

  const { balloon } = appContext
  if (balloon && balloon.opacity > 0) {
    const text = balloon.cents === null
      ? balloon.noteName
      : `${balloon.noteName}${balloon.cents >= 0 ? '+' : ''}${balloon.cents}`

    canvasContext.font = 'bold 12px Inter, sans-serif'
    const metrics = canvasContext.measureText(text)
    const padding = 6
    const balloonWidth = metrics.width + padding * 2
    const balloonHeight = 18
    const balloonX = Math.max(appContext.pitchLines.offset.x, balloon.x - balloonWidth)
    const balloonY = balloon.y - balloonHeight - 8

    canvasContext.globalAlpha = balloon.opacity
    canvasContext.fillStyle = balloonColor(balloon.cents)
    canvasContext.beginPath()
    canvasContext.roundRect(balloonX, balloonY, balloonWidth, balloonHeight, 4)
    canvasContext.fill()

    canvasContext.fillStyle = 'white'
    canvasContext.textAlign = 'center'
    canvasContext.textBaseline = 'middle'
    canvasContext.fillText(text, balloonX + balloonWidth / 2, balloonY + balloonHeight / 2)

    canvasContext.globalAlpha = 1
    canvasContext.textAlign = 'left'
    canvasContext.textBaseline = 'alphabetic'
  }
}

resizeCanvas()

let animationFrameId: number | null = null

const tick = () => {
  setContext(fadeBalloon(performance.now())(getContext()))
  paintPitches(getContext())
  animationFrameId = requestAnimationFrame(tick)
}

setupPitchDetector().then(pitchDetector => {
  pitchDetector.addPitchListener(frequency => {
    document.getElementById('pitch')!.innerHTML = frequency.toString()

    setContext(addPitch(frequency, canvas.getBoundingClientRect().width)(getContext()))
    setContext(showBalloon(frequency, canvas.getBoundingClientRect().width, performance.now())(getContext()))

    paintPitches(getContext())

    scrollLastPitchIntoView(canvasContext.canvas)(getContext())

    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(tick)
    }
  })
})