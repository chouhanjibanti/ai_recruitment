import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAvatar } from '../store/slices/avatarSlice';
import { setAvatarExpressionAsync, triggerAvatarAnimationAsync } from '../store/slices/avatarSlice';
import { useWebSocket } from '../services/websocketService';

interface Avatar2DProps {
  size?: { width: number; height: number };
  className?: string;
  showControls?: boolean;
}

const Avatar2D: React.FC<Avatar2DProps> = ({ 
  size = { width: 300, height: 400 }, 
  className = '',
  showControls = false 
}) => {
  const dispatch = useDispatch();
  const { requestAvatarAnimation, setAvatarExpression } = useWebSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const avatar = useSelector(selectAvatar);
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Avatar drawing states
  const avatarState = useRef({
    faceExpression: 'neutral',
    eyeBlink: 0,
    mouthOpen: 0,
    headTilt: 0,
    isSpeaking: false,
    currentAnimation: 'idle',
    animationFrame: 0,
  });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size.width;
    canvas.height = size.height;
    
    setIsInitialized(true);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size]);

  // Animation loop
  useEffect(() => {
    if (!isInitialized) return;

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw avatar
      drawAvatar(ctx, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, avatar]);

  // Update avatar state based on Redux state
  useEffect(() => {
    avatarState.current = {
      ...avatarState.current,
      faceExpression: avatar.currentExpression,
      isSpeaking: avatar.isSpeaking,
      currentAnimation: avatar.currentAnimation,
    };
  }, [avatar.currentExpression, avatar.isSpeaking, avatar.currentAnimation]);

  const drawAvatar = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const headRadius = Math.min(width, height) * 0.3;

    // Background
    ctx.fillStyle = avatar.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw head shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + headRadius + 20, headRadius * 0.8, headRadius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw head
    const gradient = ctx.createRadialGradient(centerX - 20, centerY - 20, 0, centerX, centerY, headRadius);
    gradient.addColorStop(0, '#fdbcb4');
    gradient.addColorStop(1, '#f4a09c');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw hair
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.arc(centerX, centerY - headRadius * 0.3, headRadius * 1.1, Math.PI, 0);
    ctx.fill();

    // Draw eyes
    const eyeY = centerY - headRadius * 0.2;
    const eyeSpacing = headRadius * 0.3;
    const eyeSize = headRadius * 0.08;

    // Left eye
    drawEye(ctx, centerX - eyeSpacing, eyeY, eyeSize, avatarState.current.eyeBlink);
    
    // Right eye
    drawEye(ctx, centerX + eyeSpacing, eyeY, eyeSize, avatarState.current.eyeBlink);

    // Draw eyebrows based on expression
    drawEyebrows(ctx, centerX, centerY - headRadius * 0.4, eyeSpacing, avatarState.current.faceExpression);

    // Draw nose
    ctx.strokeStyle = '#d4a5a5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - headRadius * 0.05);
    ctx.lineTo(centerX - 5, centerY + headRadius * 0.1);
    ctx.lineTo(centerX + 5, centerY + headRadius * 0.1);
    ctx.stroke();

    // Draw mouth based on expression and speaking state
    drawMouth(ctx, centerX, centerY + headRadius * 0.3, headRadius * 0.3, avatarState.current);

    // Draw neck
    ctx.fillStyle = '#fdbcb4';
    ctx.fillRect(centerX - headRadius * 0.3, centerY + headRadius, headRadius * 0.6, headRadius * 0.4);

    // Draw shoulders
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + headRadius * 1.3, headRadius * 1.2, headRadius * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add animation effects
    if (avatarState.current.isSpeaking) {
      // Speaking animation - subtle movement
      const time = Date.now() / 1000;
      const wobble = Math.sin(time * 10) * 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((wobble * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
      ctx.restore();
    }
  };

  const drawEye = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, blink: number) => {
    if (blink > 0.8) {
      // Eye is closed
      ctx.strokeStyle = '#4a4a4a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.stroke();
    } else {
      // Eye is open
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(x, y, size, size * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris
      ctx.fillStyle = '#4a90e2';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Eye highlight
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawEyebrows = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, spacing: number, expression: string) => {
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    let leftBrowY = centerY;
    let rightBrowY = centerY;
    let leftBrowAngle = 0;
    let rightBrowAngle = 0;

    switch (expression) {
      case 'happy':
        leftBrowY = centerY - 5;
        rightBrowY = centerY - 5;
        break;
      case 'surprised':
        leftBrowY = centerY - 10;
        rightBrowY = centerY - 10;
        leftBrowAngle = -0.2;
        rightBrowAngle = 0.2;
        break;
      case 'confused':
        leftBrowY = centerY - 8;
        rightBrowY = centerY + 2;
        leftBrowAngle = -0.3;
        rightBrowAngle = 0.1;
        break;
      case 'thinking':
        leftBrowY = centerY - 5;
        rightBrowY = centerY;
        leftBrowAngle = -0.1;
        break;
      case 'attentive':
        leftBrowY = centerY - 3;
        rightBrowY = centerY - 3;
        break;
    }

    // Left eyebrow
    ctx.beginPath();
    ctx.moveTo(centerX - spacing - 10, leftBrowY);
    ctx.lineTo(centerX - spacing + 10, leftBrowY + 5 * Math.sin(leftBrowAngle));
    ctx.stroke();

    // Right eyebrow
    ctx.beginPath();
    ctx.moveTo(centerX + spacing - 10, rightBrowY + 5 * Math.sin(rightBrowAngle));
    ctx.lineTo(centerX + spacing + 10, rightBrowY);
    ctx.stroke();
  };

  const drawMouth = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, state: any) => {
    ctx.strokeStyle = '#d4a5a5';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    if (state.isSpeaking) {
      // Speaking animation - open mouth
      const time = Date.now() / 100;
      const openAmount = Math.abs(Math.sin(time)) * 10;
      
      ctx.fillStyle = '#8b3a3a';
      ctx.beginPath();
      ctx.ellipse(x, y, width * 0.3, openAmount, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.stroke();
    } else {
      // Static expression based on mood
      switch (state.faceExpression) {
        case 'happy':
        case 'smiling':
          // Smile
          ctx.beginPath();
          ctx.arc(x, y - 5, width * 0.3, 0.2 * Math.PI, 0.8 * Math.PI);
          ctx.stroke();
          break;
        case 'surprised':
          // Open mouth
          ctx.fillStyle = '#8b3a3a';
          ctx.beginPath();
          ctx.ellipse(x, y, width * 0.2, width * 0.3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        case 'confused':
          // Crooked mouth
          ctx.beginPath();
          ctx.moveTo(x - width * 0.3, y);
          ctx.quadraticCurveTo(x, y + 5, x + width * 0.3, y - 5);
          ctx.stroke();
          break;
        case 'thinking':
          // Slightly pursed lips
          ctx.beginPath();
          ctx.moveTo(x - width * 0.2, y);
          ctx.lineTo(x + width * 0.2, y);
          ctx.stroke();
          break;
        default:
          // Neutral
          ctx.beginPath();
          ctx.moveTo(x - width * 0.2, y);
          ctx.lineTo(x + width * 0.2, y);
          ctx.stroke();
      }
    }
  };

  // Simulate eye blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance to blink
        avatarState.current.eyeBlink = 1;
        setTimeout(() => {
          avatarState.current.eyeBlink = 0;
        }, 150);
      }
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleExpressionChange = (expression: string) => {
    dispatch(setAvatarExpressionAsync(expression));
    setAvatarExpression(expression);
  };

  const handleAnimationTrigger = (animation: string) => {
    dispatch(triggerAvatarAnimationAsync({ animation }));
    requestAvatarAnimation(animation);
  };

  if (!avatar.isVisible) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-lg"
        style={{ width: size.width, height: size.height }}
      />
      
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-gray-700">Expression:</label>
              <select
                value={avatar.currentExpression}
                onChange={(e) => handleExpressionChange(e.target.value)}
                className="w-full mt-1 text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="neutral">Neutral</option>
                <option value="happy">Happy</option>
                <option value="smiling">Smiling</option>
                <option value="surprised">Surprised</option>
                <option value="confused">Confused</option>
                <option value="thinking">Thinking</option>
                <option value="attentive">Attentive</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700">Animation:</label>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  onClick={() => handleAnimationTrigger('idle')}
                  className="text-xs bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600"
                >
                  Idle
                </button>
                <button
                  onClick={() => handleAnimationTrigger('speaking')}
                  className="text-xs bg-green-500 text-white rounded px-2 py-1 hover:bg-green-600"
                >
                  Speaking
                </button>
                <button
                  onClick={() => handleAnimationTrigger('listening')}
                  className="text-xs bg-purple-500 text-white rounded px-2 py-1 hover:bg-purple-600"
                >
                  Listening
                </button>
                <button
                  onClick={() => handleAnimationTrigger('nodding')}
                  className="text-xs bg-orange-500 text-white rounded px-2 py-1 hover:bg-orange-600"
                >
                  Nodding
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {avatar.isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default Avatar2D;
