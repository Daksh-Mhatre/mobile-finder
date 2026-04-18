// Audio analysis utility functions

/**
 * Calculate the RMS (Root Mean Square) volume level from audio data
 * @param {Uint8Array} dataArray - Audio frequency/time data
 * @returns {number} Normalized RMS level between 0 and 1
 */
export function calculateRMS(dataArray) {
  if (!dataArray || dataArray.length === 0) return 0;
  
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const normalized = (dataArray[i] - 128) / 128;
    sum += normalized * normalized;
  }
  return Math.sqrt(sum / dataArray.length);
}

/**
 * Calculate peak amplitude from audio data
 * @param {Uint8Array} dataArray - Audio time domain data
 * @returns {number} Peak amplitude between 0 and 1
 */
export function calculatePeak(dataArray) {
  if (!dataArray || dataArray.length === 0) return 0;
  
  let max = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const amplitude = Math.abs(dataArray[i] - 128) / 128;
    if (amplitude > max) max = amplitude;
  }
  return max;
}

/**
 * Apply exponential smoothing to a value
 * @param {number} currentValue - The current raw value
 * @param {number} previousSmoothed - The previously smoothed value
 * @param {number} alpha - Smoothing factor (0-1), lower = smoother
 * @returns {number} Smoothed value
 */
export function exponentialSmooth(currentValue, previousSmoothed, alpha = 0.3) {
  return alpha * currentValue + (1 - alpha) * previousSmoothed;
}

/**
 * Detect if a peak exceeds a dynamic threshold based on sensitivity
 * @param {number} peak - Current peak value
 * @param {number} sensitivity - Sensitivity (0-100)
 * @param {number} baseThreshold - Base threshold value
 * @returns {boolean} Whether a peak was detected
 */
export function isPeakDetected(peak, sensitivity, baseThreshold = 0.35) {
  // Higher sensitivity = lower threshold (easier to trigger)
  const adjustedThreshold = baseThreshold * (1 - (sensitivity / 150));
  return peak > adjustedThreshold;
}

/**
 * Get frequency data as normalized array for visualization
 * @param {AnalyserNode} analyser - Web Audio API AnalyserNode
 * @returns {number[]} Array of normalized frequency values (0-1)
 */
export function getFrequencyData(analyser) {
  if (!analyser) return new Array(32).fill(0);
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  
  // Downsample to 32 bars
  const barCount = 32;
  const step = Math.floor(bufferLength / barCount);
  const bars = [];
  
  for (let i = 0; i < barCount; i++) {
    let sum = 0;
    for (let j = 0; j < step; j++) {
      sum += dataArray[i * step + j];
    }
    bars.push((sum / step) / 255);
  }
  
  return bars;
}

/**
 * Generate simulated waveform data
 * @param {number} intensity - Intensity level (0-1)
 * @param {number} barCount - Number of bars
 * @returns {number[]} Array of simulated bar heights
 */
export function generateSimulatedWaveform(intensity = 0.3, barCount = 32) {
  const bars = [];
  const time = Date.now() / 1000;
  
  for (let i = 0; i < barCount; i++) {
    const wave = Math.sin(time * 3 + i * 0.5) * 0.3;
    const wave2 = Math.sin(time * 5 + i * 0.3) * 0.2;
    const noise = Math.random() * 0.1;
    const value = Math.max(0, Math.min(1, (wave + wave2 + noise + 0.3) * intensity));
    bars.push(value);
  }
  
  return bars;
}
