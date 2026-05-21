import noteFrequencyTuples from '../constants/noteFrequencyTuples'
import workletUrl from './pitchDetector.worklet?worker&url'

export const setupPitchDetector = async () => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const audioContext = new window.AudioContext()
  const source = audioContext.createMediaStreamSource(mediaStream)

  await audioContext.audioWorklet.addModule(workletUrl)

  const node = new AudioWorkletNode(audioContext, 'pitch-detector-processor', {
    processorOptions: {
      sampleRate: audioContext.sampleRate,
      minFrequency: noteFrequencyTuples[0][1],
      maxFrequency: noteFrequencyTuples.at(-1)[1],
    },
  })

  source.connect(node)
  node.connect(audioContext.destination)

  const pitchListeners = []
  node.port.onmessage = data => {
    if (data.data.type === 'pitch') {
      const frequency = data.data.frequency
      pitchListeners.forEach(pitchListener => pitchListener(frequency))
    }
  }

  const addPitchListener = pitchListener => {
    if (typeof pitchListener !== 'function') {
      return
    }

    pitchListeners.push(pitchListener)
  }

  return {
    addPitchListener,
  }
}
