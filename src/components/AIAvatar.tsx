import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2, AlertCircle } from 'lucide-react';

// Avatar states
export enum AvatarState {
  IDLE = 'idle',
  SPEAKING = 'speaking',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  ERROR = 'error',
}

interface AvatarProps {
  state: AvatarState;
  question?: string;
  isRecording: boolean;
  onToggleRecording: () => void;
  onSkipQuestion: () => void;
  volume?: number;
}

const AIAvatar: React.FC<AvatarProps> = ({
  state,
  question,
  isRecording,
  onToggleRecording,
  onSkipQuestion,
  volume = 0.8
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simple 2D avatar animation using Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const drawAvatar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Avatar background circle
      ctx.fillStyle = state === AvatarState.ERROR ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(150, 150, 80, 0, Math.PI * 2);
      ctx.fill();

      // Avatar face
      ctx.fillStyle = '#ffffff';
      
      // Eyes
      if (state === AvatarState.SPEAKING) {
        // Animated eyes when speaking
        const eyeHeight = Math.sin(time * 0.1) * 3 + 8;
        ctx.fillRect(120, 130, 15, Math.abs(eyeHeight));
        ctx.fillRect(165, 130, 15, Math.abs(eyeHeight));
      } else if (state === AvatarState.LISTENING) {
        // Eyes looking around when listening
        const eyeOffset = Math.sin(time * 0.05) * 2;
        ctx.fillRect(120 + eyeOffset, 130, 15, 10);
        ctx.fillRect(165 + eyeOffset, 130, 15, 10);
      } else {
        // Normal eyes
        ctx.fillRect(120, 130, 15, 10);
        ctx.fillRect(165, 130, 15, 10);
      }

      // Mouth
      if (state === AvatarState.SPEAKING) {
        // Animated mouth when speaking
        const mouthWidth = Math.abs(Math.sin(time * 0.2)) * 20 + 20;
        ctx.fillRect(135, 160, mouthWidth, 8);
      } else if (state === AvatarState.LISTENING) {
        // Open mouth when listening
        ctx.fillRect(135, 160, 30, 15);
      } else {
        // Normal mouth
        ctx.fillRect(135, 160, 30, 5);
      }

      // Processing indicator
      if (state === AvatarState.PROCESSING) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(150, 150, 90, (time * 0.05) % (Math.PI * 2), (time * 0.05 + Math.PI) % (Math.PI * 2));
        ctx.stroke();
      }

      time++;
      animationFrame = requestAnimationFrame(drawAvatar);
    };

    drawAvatar();
    animationRef.current = animationFrame;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state]);

  // Get state color and icon
  const getStateInfo = () => {
    switch (state) {
      case AvatarState.SPEAKING:
        return { color: 'bg-green-500', icon: Volume2, text: 'Speaking...' };
      case AvatarState.LISTENING:
        return { color: 'bg-blue-500', icon: Mic, text: 'Listening...' };
      case AvatarState.PROCESSING:
        return { color: 'bg-yellow-500', icon: Loader2, text: 'Processing...' };
      case AvatarState.ERROR:
        return { color: 'bg-red-500', icon: AlertCircle, text: 'Error' };
      default:
        return { color: 'bg-gray-500', icon: null, text: 'Ready' };
    }
  };

  const stateInfo = getStateInfo();
  const StateIcon = stateInfo.icon;

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-lg shadow-lg">
      {/* Avatar Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="rounded-full border-4 border-gray-200"
        />
        
        {/* State Indicator */}
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-xs font-medium ${stateInfo.color}`}>
          {stateInfo.text}
        </div>
      </div>

      {/* Question Display */}
      {question && (
        <div className="max-w-md p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-gray-800 text-center font-medium">{question}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center space-x-4">
        {/* Record Button */}
        <button
          onClick={onToggleRecording}
          disabled={state === AvatarState.PROCESSING}
          className={`p-4 rounded-full transition-all ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : state === AvatarState.PROCESSING
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Skip Button */}
        <button
          onClick={onSkipQuestion}
          disabled={state === AvatarState.PROCESSING}
          className={`px-4 py-2 rounded-lg transition-all ${
            state === AvatarState.PROCESSING
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
        >
          Skip
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2 w-full max-w-xs">
        <Volume2 className="w-4 h-4 text-gray-600" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => {
            // Volume control would be handled by parent
            console.log('Volume changed:', e.target.value);
          }}
          className="flex-1"
        />
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 max-w-md">
        {state === AvatarState.LISTENING && (
          <p>Click the microphone button to start speaking, or press and hold for push-to-talk.</p>
        )}
        {state === AvatarState.SPEAKING && (
          <p>Listen carefully to the question. You'll have a chance to respond when it finishes.</p>
        )}
        {state === AvatarState.PROCESSING && (
          <p>Processing your response. Please wait...</p>
        )}
        {state === AvatarState.ERROR && (
          <p>There was an error. Please try again or contact support.</p>
        )}
      </div>
    </div>
  );
};

export default AIAvatar;
