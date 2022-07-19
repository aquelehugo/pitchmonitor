import * as pitchfinder from 'pitchfinder'

export const setupPitchDetector = async () => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const audioContext = new window.AudioContext()
  const source = audioContext.createMediaStreamSource(mediaStream)
  const node = audioContext.createScriptProcessor(0, 1, 1)
  source.connect(node)
  node.connect(audioContext.destination)

  const pitchListeners = []
  node.onaudioprocess = data => {
    const channelData = data.inputBuffer.getChannelData(0)

    const frequency = pitchfinder.AMDF({
      minFrequency: 60,
      sampleRate: audioContext.sampleRate,
      maxFrequency: 1000,
    })(channelData)

    if (frequency) {
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
