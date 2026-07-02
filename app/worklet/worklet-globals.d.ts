declare abstract class AudioWorkletProcessor {
  protected constructor(options?: AudioWorkletNodeOptions)
  readonly port: MessagePort
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean
}

interface AudioWorkletNodeOptions {
  numberOfInputs?: number
  numberOfOutputs?: number
  outputChannelCount?: number[]
  parameterData?: Record<string, number>
  processorOptions?: unknown
}

declare function registerProcessor(
  name: string,
  processorCtor: typeof AudioWorkletProcessor,
): void

declare const sampleRate: number
declare const currentFrame: number
declare const currentTime: number