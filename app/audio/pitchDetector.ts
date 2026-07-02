import noteFrequencyTuples from '../constants/noteFrequencyTuples'
import workletUrl from '../worklet/pitchDetector.worklet?worker&url'

export interface PitchDetector {
  addPitchListener: (pitchListener: (frequency: number) => void) => void
}

interface PitchMessageData {
  type: 'pitch'
  frequency: number
}

export const setupPitchDetector = async (): Promise<PitchDetector> => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const audioContext = new window.AudioContext()
  const source = audioContext.createMediaStreamSource(mediaStream)

  await audioContext.audioWorklet.addModule(workletUrl)

  const node = new AudioWorkletNode(audioContext, 'pitch-detector-processor', {
    processorOptions: {
      sampleRate: audioContext.sampleRate,
      minFrequency: noteFrequencyTuples[0][1],
      maxFrequency: noteFrequencyTuples.at(-1)![1],
    },
  })

  source.connect(node)
  node.connect(audioContext.destination)

  const pitchListeners: Array<(frequency: number) => void> = []
  node.port.onmessage = (data: MessageEvent<PitchMessageData>) => {
    if (data.data.type === 'pitch') {
      const frequency = data.data.frequency
      pitchListeners.forEach(pitchListener => pitchListener(frequency))
    }
  }

  const addPitchListener = (pitchListener: (frequency: number) => void): void => {
    if (typeof pitchListener !== 'function') {
      return
    }

    pitchListeners.push(pitchListener)
  }

  return {
    addPitchListener,
  }
}