// Mock voice parser utility for transcript normalization and phrase matching
// Supports English and Marathi (romanized + Devanagari)

import { TARGET_PHRASES, KEY_WORDS_EN, KEY_WORDS_MR } from './constants';

/**
 * Normalize a transcript string for comparison
 * Handles both Latin and Devanagari scripts
 * @param {string} text - Raw transcript text
 * @returns {string} Normalized text
 */
export function normalizeTranscript(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/['']/g, "'")
    // Keep Devanagari characters (\u0900-\u097F) alongside Latin
    .replace(/[^\w\s'\u0900-\u097F]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Check if a transcript matches any target phrase (English + Marathi)
 * @param {string} transcript - The speech transcript to check
 * @returns {{ matched: boolean, phrase: string | null, confidence: number, lang: string | null }}
 */
export function checkPhraseMatch(transcript) {
  const normalized = normalizeTranscript(transcript);

  if (!normalized) {
    return { matched: false, phrase: null, confidence: 0, lang: null };
  }

  // Direct match against all known phrases
  for (const phrase of TARGET_PHRASES) {
    if (normalized.includes(phrase)) {
      const lang = isDevanagari(phrase) || isMarathiRomanized(phrase) ? 'mr' : 'en';
      return { matched: true, phrase, confidence: 1.0, lang };
    }
  }

  // Fuzzy match — English keywords
  const words = normalized.split(' ');
  let enMatchCount = 0;
  for (const word of words) {
    if (KEY_WORDS_EN.includes(word)) enMatchCount++;
  }
  const enConfidence = enMatchCount / 3;

  // Fuzzy match — Marathi keywords (romanized + Devanagari)
  let mrMatchCount = 0;
  for (const word of words) {
    if (KEY_WORDS_MR.includes(word)) mrMatchCount++;
  }
  const mrConfidence = mrMatchCount / 2; // Marathi phrases tend to be shorter (2 keywords = strong match)

  // Return best match
  if (mrConfidence >= 0.8) {
    return { matched: true, phrase: normalized, confidence: Math.min(mrConfidence, 1), lang: 'mr' };
  }
  if (enConfidence >= 0.8) {
    return { matched: true, phrase: normalized, confidence: Math.min(enConfidence, 1), lang: 'en' };
  }

  const bestConfidence = Math.max(enConfidence, mrConfidence);
  return { matched: false, phrase: null, confidence: bestConfidence, lang: null };
}

/**
 * Check if text contains Devanagari characters
 */
function isDevanagari(text) {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Check if romanized text looks like Marathi
 */
function isMarathiRomanized(text) {
  const mrWords = ['maza', 'mazha', 'mala', 'kuthe', 'kuthay', 'shodha', 'saapad', 'sapad', 'aahe'];
  const words = text.toLowerCase().split(' ');
  return words.some(w => mrWords.includes(w));
}

/**
 * Generate a simulated transcript for demo/mock mode
 * @param {boolean} shouldMatch - Whether to generate a matching phrase
 * @param {string} lang - Language code ('en-US' or 'mr-IN')
 * @returns {string}
 */
export function generateMockTranscript(shouldMatch = true, lang = 'en-US') {
  if (shouldMatch) {
    if (lang === 'mr-IN') {
      const options = [
        'माझा मोबाइल कुठे',
        'माझा फोन कुठे आहे',
        'मोबाइल कुठे',
        'माझा मोबाईल शोधा',
      ];
      return options[Math.floor(Math.random() * options.length)];
    }
    const options = [
      "where's my mobile",
      "where is my phone",
      "find my phone",
      "where's my phone",
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (lang === 'mr-IN') {
    const distractors = [
      'नमस्कार',
      'किती वाजले',
      'गाणे लाव',
      'दिवा लाव',
      'टाइमर लाव',
    ];
    return distractors[Math.floor(Math.random() * distractors.length)];
  }

  const distractors = [
    'hello there',
    'what time is it',
    'play some music',
    'turn on the lights',
    'set a timer',
  ];
  return distractors[Math.floor(Math.random() * distractors.length)];
}
