import { Macleod } from 'pitchfinder'
import noteFrequencyTuples from '../constants/noteFrequencyTuples'
import {
  createSmoothingState,
  smoothPitch,
  type SmoothingState,
} from '../core/smoothPitch'

type ProbabalisticPitchDetector = (
  float32AudioBuffer: Float32Array,
) => { probability: number; freq: number }

const BUFFER_SIZE = 1024

interface ProcessorOptions {
  processorOptions?: {
    sampleRate?: number
    minFrequency?: number
    maxFrequency?: number
  }
}

class PitchDetectorProcessor extends AudioWorkletProcessor {
  buffer: Float32Array
  bufferIndex = 0
  minFreq: number
  maxFreq: number
  detectPitch: ProbabalisticPitchDetector
  smoothingState: SmoothingState

  constructor(options?: ProcessorOptions) {
    super(options)
    this.buffer = new Float32Array(BUFFER_SIZE)
    this.smoothingState = createSmoothingState(5, 0.3)

    const sampleRate = options?.processorOptions?.sampleRate ?? 44100
    this.minFreq =
      options?.processorOptions?.minFrequency ?? noteFrequencyTuples[0][1]
    this.maxFreq =
      options?.processorOptions?.maxFrequency ?? noteFrequencyTuples.at(-1)![1]

    this.detectPitch = Macleod({
      sampleRate,
      bufferSize: BUFFER_SIZE,
    })
  }

  process(
    inputs: Float32Array[][],
    _outputs: Float32Array[][],
    _parameters: Record<string, Float32Array>,
  ): boolean {
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
            const { smoothedFrequency, state } = smoothPitch(
              frequency,
              this.smoothingState,
            )
            this.smoothingState = state
            this.port.postMessage({
              type: 'pitch',
              frequency: smoothedFrequency,
            })
          }
          this.bufferIndex = 0
        }
      }
    }

    return true
  }
}

registerProcessor('pitch-detector-processor', PitchDetectorProcessor)
