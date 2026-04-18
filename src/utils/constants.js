// App-wide constants and configuration

export const APP_NAME = 'PhonePulse';
export const APP_TAGLINE = 'Find your phone with sound and voice';

// Detection modes
export const MODES = {
  CLAP: 'clap',
  VOICE: 'voice',
  BOTH: 'both',
};

export const MODE_LABELS = {
  [MODES.CLAP]: 'Clap Only',
  [MODES.VOICE]: 'Voice Only',
  [MODES.BOTH]: 'Clap + Voice',
};

// App states
export const STATES = {
  IDLE: 'idle',
  REQUESTING_MIC: 'requesting_mic',
  LISTENING_CLAP: 'listening_clap',
  LISTENING_VOICE: 'listening_voice',
  LISTENING_BOTH: 'listening_both',
  TRIGGER_DETECTED: 'trigger_detected',
  RINGING: 'ringing',
};

export const STATE_LABELS = {
  [STATES.IDLE]: 'Idle',
  [STATES.REQUESTING_MIC]: 'Requesting Microphone…',
  [STATES.LISTENING_CLAP]: 'Listening for 2 Claps',
  [STATES.LISTENING_VOICE]: 'Listening for Phrase',
  [STATES.LISTENING_BOTH]: 'Listening for Clap + Voice',
  [STATES.TRIGGER_DETECTED]: 'Trigger Detected!',
  [STATES.RINGING]: 'Ringing',
};

// Mic permission states
export const MIC_STATUS = {
  PENDING: 'pending',
  GRANTED: 'granted',
  DENIED: 'denied',
};

// Clap detection defaults
export const CLAP_DEFAULTS = {
  SENSITIVITY: 65, // 0-100 range, higher = more sensitive
  COOLDOWN_MS: 2000,
  DOUBLE_CLAP_WINDOW_MS: 800,
  MIN_CLAP_INTERVAL_MS: 100,
  PEAK_THRESHOLD_BASE: 0.35,
};

// Ring defaults
export const RING_DEFAULTS = {
  VOLUME: 80,
  AUTO_STOP_SECONDS: 30,
  SNOOZE_SECONDS: 10,
};

// Supported languages
export const LANGUAGES = {
  EN: 'en-US',
  MR: 'mr-IN',
};

export const LANGUAGE_LABELS = {
  [LANGUAGES.EN]: 'English',
  [LANGUAGES.MR]: 'मराठी (Marathi)',
};

// Target phrases for voice detection — English
export const TARGET_PHRASES_EN = [
  "where's my mobile",
  'wheres my mobile',
  'where is my mobile',
  "where's my phone",
  'wheres my phone',
  'where is my phone',
  'find my phone',
  'find my mobile',
];

// Target phrases for voice detection — Marathi (romanized + Devanagari)
export const TARGET_PHRASES_MR = [
  // Core phrase variations — romanized
  'maza mobile kuthe',
  'maza mobile kuthe aahe',
  'maza phone kuthe',
  'maza phone kuthe aahe',
  'mazha mobile kuthe',
  'mazha mobile kuthe aahe',
  'mazha phone kuthe',
  'mazha phone kuthe aahe',
  'mobile kuthe aahe',
  'phone kuthe aahe',
  'maza mobile shodha',
  'maza phone shodha',
  'mazha mobile shodha',
  'mazha phone shodha',
  'mobile kuthe',
  'phone kuthe',
  'maza mobile kuthay',
  'mazha mobile kuthay',
  'maza phone kuthay',
  'mazha phone kuthay',
  'mala mobile saapad',
  'mala phone saapad',
  'mala mobile sapad',
  'mala phone sapad',
  // Devanagari script
  'माझा मोबाइल कुठे',
  'माझा मोबाईल कुठे',
  'माझा मोबाइल कुठे आहे',
  'माझा मोबाईल कुठे आहे',
  'माझा फोन कुठे',
  'माझा फोन कुठे आहे',
  'मोबाइल कुठे आहे',
  'मोबाईल कुठे आहे',
  'फोन कुठे आहे',
  'माझा मोबाइल शोधा',
  'माझा मोबाईल शोधा',
  'माझा फोन शोधा',
  'मोबाइल कुठे',
  'मोबाईल कुठे',
  'फोन कुठे',
  'माझा मोबाइल कुठाय',
  'माझा मोबाईल कुठाय',
  'माझा फोन कुठाय',
  'मला मोबाइल सापड',
  'मला मोबाईल सापड',
  'मला फोन सापड',
];

// Combined — all target phrases
export const TARGET_PHRASES = [...TARGET_PHRASES_EN, ...TARGET_PHRASES_MR];

// Keywords per language for fuzzy matching
export const KEY_WORDS_EN = ['where', 'wheres', 'find', 'my', 'mobile', 'phone'];
export const KEY_WORDS_MR = [
  'maza', 'mazha', 'mala',
  'mobile', 'phone', 'mobaile', 'fon',
  'kuthe', 'kuthay', 'kutha', 'shodha', 'saapad', 'sapad',
  'aahe',
  // Devanagari keywords
  'माझा', 'मला',
  'मोबाइल', 'मोबाईल', 'फोन',
  'कुठे', 'कुठाय', 'शोधा', 'सापड',
  'आहे',
];

// Event log types
export const LOG_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  TRIGGER: 'trigger',
};

// Badge variants
export const BADGE_VARIANTS = {
  IDLE: { label: 'Idle', color: '#6b7280' },
  LISTENING: { label: 'Listening', color: '#3b82f6' },
  MIC_BLOCKED: { label: 'Mic Blocked', color: '#ef4444' },
  VOICE_UNSUPPORTED: { label: 'Voice N/A', color: '#f59e0b' },
  RINGING: { label: 'Ringing', color: '#ef4444' },
  DEMO: { label: 'Demo Mode', color: '#8b5cf6' },
};
