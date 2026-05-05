import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Cache the voice to avoid recalculating and searching every time
let cachedVoice: SpeechSynthesisVoice | null = null;

// Pre-wake the speech synthesis engine to reduce first-time delay
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null; // Invalidate cache when voices load or change
  };
}

export function speakText(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Clear the queue to ensure immediate playback
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  if (!cachedVoice) {
    const voices = window.speechSynthesis.getVoices();

    // Priority 1: High-quality local/offline English voice (fast + good)
    cachedVoice = voices.find(v => v.lang.startsWith('en-') && v.localService && (v.name.includes('Premium') || v.name.includes('Natural'))) || null;

    // Priority 2: Any local/offline English voice (fastest)
    if (!cachedVoice) {
      cachedVoice = voices.find(v => v.lang.startsWith('en-') && v.localService) || null;
    }

    // Priority 3: Any English voice (might be network-based like Google US English, which causes delay)
    if (!cachedVoice) {
      cachedVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en-')) || null;
    }
  }

  if (cachedVoice) {
    utterance.voice = cachedVoice;
  }
  utterance.lang = 'en-US';

  window.speechSynthesis.speak(utterance);
}
