// Audio Service for TTS and STT functionality

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export class AudioService {
  private synthesis: SpeechSynthesis;
  private recognition: any = null;
  private isSupported: boolean;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (this.isSupported) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;
  }

  // Text-to-Speech: Play audio from text
  async speakText(text: string, options: {
    voice?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure utterance
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 0.8;

      // Select voice if specified
      if (options.voice) {
        const voices = this.synthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.name === options.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  // Speech-to-Text: Convert speech to text
  startSpeechRecognition(
    onResult: (event: SpeechRecognitionResult) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition || !this.isSupported) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      // Stop any ongoing recognition
      this.recognition.stop();

      // Set up event handlers
      this.recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          onResult({
            transcript: result[0].transcript,
            confidence: result[0].confidence,
            isFinal: true
          });
        } else {
          onResult({
            transcript: result[0].transcript,
            confidence: result[0].confidence,
            isFinal: false
          });
        }
      };

      this.recognition.onerror = (event: any) => {
        const errorMessage = `Speech recognition error: ${event.error}`;
        onError?.(errorMessage);
        reject(new Error(errorMessage));
      };

      this.recognition.onend = () => {
        resolve();
      };

      // Start recognition
      this.recognition.start();
    });
  }

  // Stop speech recognition
  stopSpeechRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  // Check if speech recognition is supported
  isSpeechRecognitionSupported(): boolean {
    return this.isSupported;
  }

  // Get available voices for TTS
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  // Stop all speech synthesis
  stopSpeaking(): void {
    this.synthesis.cancel();
  }

  // Check if currently speaking
  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  // Get available languages for speech recognition
  getAvailableLanguages(): string[] {
    // Common languages that support speech recognition
    return [
      'en-US',
      'en-GB',
      'es-ES',
      'fr-FR',
      'de-DE',
      'it-IT',
      'pt-BR',
      'ru-RU',
      'ja-JP',
      'ko-KR',
      'zh-CN'
    ];
  }

  // Set recognition language
  setRecognitionLanguage(language: string): void {
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  // Play audio from URL (for pre-recorded audio from backend)
  async playAudioFromUrl(audioUrl: string, volume: number = 0.8): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audio.volume = volume;
      
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Failed to play audio'));
      
      audio.play().catch(reject);
    });
  }

  // Convert audio blob to text (for backend processing)
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    // This would typically send the audio to a backend STT service
    // For now, return a placeholder
    console.log('Audio blob for transcription:', audioBlob);
    return 'Transcription would happen here';
  }

  // Record audio from microphone
  async recordAudio(duration: number = 5000): Promise<Blob> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          const chunks: Blob[] = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: 'audio/wav' });
            resolve(audioBlob);
          };

          mediaRecorder.onerror = (event) => {
            reject(new Error('MediaRecorder error'));
          };

          mediaRecorder.start();
          
          // Stop recording after specified duration
          setTimeout(() => {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
          }, duration);
        })
        .catch(reject);
    });
  }
}

// Create singleton instance
export const audioService = new AudioService();

// Hook for using audio service
export const useAudioService = () => {
  return {
    speakText: audioService.speakText.bind(audioService),
    startSpeechRecognition: audioService.startSpeechRecognition.bind(audioService),
    stopSpeechRecognition: audioService.stopSpeechRecognition.bind(audioService),
    playAudioFromUrl: audioService.playAudioFromUrl.bind(audioService),
    recordAudio: audioService.recordAudio.bind(audioService),
    stopSpeaking: audioService.stopSpeaking.bind(audioService),
    isSpeaking: audioService.isSpeaking.bind(audioService),
    isSpeechRecognitionSupported: audioService.isSpeechRecognitionSupported.bind(audioService),
    getAvailableVoices: audioService.getAvailableVoices.bind(audioService),
    setRecognitionLanguage: audioService.setRecognitionLanguage.bind(audioService),
  };
};
