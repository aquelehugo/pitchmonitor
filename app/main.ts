import './style.css'
import noteFrequencyTuples from './constants/noteFrequencyTuples'
import { setupPitchDetector } from './audio/pitchDetector'
import getLogPitchY from './core/getLogPitchY'
import { getContext, setContext, type AppContext } from './core/appContext'
import addPitch from './core/addPitch'
import scrollLastPitchIntoView from './core/scrollLastPitchIntoView'
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
  canvasContext.fillStyle = 'blue'
  canvasContext.font = '10px'

  const cssWidth = canvas.getBoundingClientRect().width

  noteFrequencyTuples.forEach(noteFrequencyTuple => {
    const [note, frequency] = noteFrequencyTuple
    const pitchY = getLogPitchY(frequency)(appContext)

    canvasContext.fillText(note, 8, pitchY)
    canvasContext.fillRect(
      appContext.pitchLines.offset.x,
      pitchY,
      cssWidth,
      1,
    )
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
}

resizeCanvas()

setupPitchDetector().then(pitchDetector => {
  pitchDetector.addPitchListener(frequency => {
    document.getElementById('pitch')!.innerHTML = frequency.toString()

    setContext(addPitch(frequency, canvas.getBoundingClientRect().width)(getContext()))

    paintPitches(getContext())

    scrollLastPitchIntoView(canvasContext.canvas)(getContext())
  })
})