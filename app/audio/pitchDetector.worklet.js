import { Macleod } from 'pitchfinder'
import noteFrequencyTuples from '../constants/noteFrequencyTuples.js'

const BUFFER_SIZE = 2048

class PitchDetectorProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options)
    this.buffer = new Float32Array(BUFFER_SIZE)
    this.bufferIndex = 0

    const sampleRate = options?.processorOptions?.sampleRate || 44100
    this.minFreq =
      options?.processorOptions?.minFrequency || noteFrequencyTuples[0][1]
    this.maxFreq =
      options?.processorOptions?.maxFrequency || noteFrequencyTuples.at(-1)[1]

    this.detectPitch = Macleod({
      sampleRate,
      bufferSize: BUFFER_SIZE,
    })
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0]

    if (input.length > 0) {
      const channelData = input[0]

      if (channelData && channelData.length > 0) {
        // Fill buffer
        for (let i = 0; i < channelData.length; i++) {
          if (this.bufferIndex < BUFFER_SIZE) {
            this.buffer[this.bufferIndex++] = channelData[i]
          }
        }

        // Process when full
        if (this.bufferIndex >= BUFFER_SIZE) {
          const { freq: frequency, probability } = this.detectPitch(this.buffer)

          if (
            frequency <= this.maxFreq &&
            frequency >= this.minFreq &&
            probability >= 0.9
          ) {
            this.port.postMessage({ type: 'pitch', frequency })
          }
          this.bufferIndex = 0
        }
      }
    }

    return true
  }
}

registerProcessor('pitch-detector-processor', PitchDetectorProcessor)
