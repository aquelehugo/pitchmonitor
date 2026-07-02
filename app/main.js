import './style.css'
import noteFrequencyTuples from './constants/noteFrequencyTuples'
import { setupPitchDetector } from './audio/pitchDetector'
import getLogPitchY from './core/getLogPitchY'
import { getContext, setContext } from './core/appContext'
import addPitch from './core/addPitch'
import logoUrl from '../public/pitchmonitor.svg'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Pitch Monitor <img src="${logoUrl}" height="48" width="48"></h1>
    <div>last pitch: <span id="pitch">N/A</span></div>
    <canvas />
  </div>
`

const canvas = document.querySelector('canvas')

// Calculate height needed to show all notes
const firstNoteFrequency = noteFrequencyTuples[0][1]
const lastNoteFrequency = noteFrequencyTuples.at(-1)[1]
const { baseDistance, offset } = getContext().pitchLines
const requiredHeight =
  Math.log2(lastNoteFrequency) * baseDistance -
  Math.log2(firstNoteFrequency) * baseDistance +
  offset.y +
  50 // padding

const resizeCanvas = () => {
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = requiredHeight
}
resizeCanvas()
window.addEventListener('resize', resizeCanvas)

const canvasContext = canvas.getContext('2d')

const paintNotesLines = appContext => {
  canvasContext.fillStyle = 'blue'
  canvasContext.font = '10px'

  noteFrequencyTuples.forEach(noteFrequencyTuple => {
    const [note, frequency] = noteFrequencyTuple
    const pitchY = getLogPitchY(frequency)(appContext)

    canvasContext.fillText(note, 8, pitchY)
    canvasContext.fillRect(
      appContext.pitchLines.offset.x,
      pitchY,
      canvas.width,
      1,
    )
  })
}

const paintMonitorBoard = appContext => {
  canvasContext.fillStyle = 'white'
  canvasContext.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  )
  paintNotesLines(appContext)
}

const paintPitches = appContext => {
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

paintMonitorBoard(getContext())

setupPitchDetector().then(pitchDetector => {
  pitchDetector.addPitchListener(frequency => {
    document.getElementById('pitch').innerHTML = frequency

    setContext(addPitch(frequency, canvas.width)(getContext()))

    paintPitches(getContext())
  })
})
