// ─── Audio Manager ────────────────────────────────────────────────────────────
// Provides browser-based TTS and audio playback utilities

let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentAudio: HTMLAudioElement | null = null;

export interface SpeakOptions {
  pitch?: number;
  rate?: number;
  lang?: string;
  volume?: number;
}

/**
 * Speak text using the browser's Web Speech API
 */
export function speakText(text: string, opts?: SpeakOptions): void {
  stopSpeech();
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = opts?.pitch ?? 1;
  utterance.rate = opts?.rate ?? 1;
  utterance.lang = opts?.lang ?? "en-US";
  utterance.volume = opts?.volume ?? 1;
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any currently playing speech
 */
export function stopSpeech(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

/**
 * Play a voice audio URL (e.g. from ElevenLabs TTS endpoint)
 */
export async function playVoice(audioUrl: string): Promise<void> {
  stopVoice();
  const audio = new Audio(audioUrl);
  currentAudio = audio;
  try {
    await audio.play();
  } catch (err) {
    console.warn("Audio playback failed:", err);
  }
}

/**
 * Stop any currently playing voice audio
 */
export function stopVoice(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Check if speech synthesis is currently active
 */
export function isSpeaking(): boolean {
  return window.speechSynthesis?.speaking ?? false;
}
