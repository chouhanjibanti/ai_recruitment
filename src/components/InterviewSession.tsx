import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Phone, Mic, MicOff, Video, VideoOff, MessageSquare, Users, Settings } from 'lucide-react';
import { selectCurrentSession, selectInterviewTranscript, selectInterviewFeedback } from '../store/slices/interviewsSlice';
import { selectAvatar } from '../store/slices/avatarSlice';
import { useWebSocket } from '../services/websocketService';
import Avatar2D from './Avatar2D';
import { startInterviewSessionAsync, endInterviewSessionAsync, submitInterviewAnswerAsync } from '../store/slices/interviewsSlice';

interface InterviewSessionProps {
  sessionId?: string;
  candidateId?: string;
  jobId?: string;
  onEnd?: () => void;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ 
  sessionId: propSessionId,
  candidateId,
  jobId,
  onEnd 
}) => {
  const dispatch = useDispatch();
  const { 
    joinInterviewSession, 
    leaveInterviewSession, 
    sendInterviewAnswer,
    startInterview,
    endInterview 
  } = useWebSocket();
  
  const currentSession = useSelector(selectCurrentSession);
  const transcript = useSelector(selectInterviewTranscript);
  const feedback = useSelector(selectInterviewFeedback);
  const avatar = useSelector(selectAvatar);
  
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showAvatar, setShowAvatar] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sessionId = propSessionId || currentSession?.id;

  // Initialize session
  useEffect(() => {
    if (sessionId && !currentSession) {
      joinInterviewSession(sessionId);
    }

    return () => {
      if (sessionId) {
        leaveInterviewSession(sessionId);
      }
    };
  }, [sessionId, currentSession, joinInterviewSession, leaveInterviewSession]);

  // Timer
  useEffect(() => {
    if (currentSession?.status === 'LIVE') {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentSession?.status]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        
        // Here you would send the audio to your speech-to-text service
        // For now, we'll simulate it
        const simulatedText = "This is a simulated answer from speech recognition.";
        setUserAnswer(simulatedText);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !sessionId) return;

    try {
      await dispatch(submitInterviewAnswerAsync({ sessionId, answer: userAnswer }));
      sendInterviewAnswer(sessionId, userAnswer);
      setUserAnswer('');
      
      // Simulate next question
      setTimeout(() => {
        const questions = [
          "Can you tell me about a challenging project you've worked on?",
          "How do you handle conflicts in a team environment?",
          "What are your career goals for the next 5 years?",
          "Describe your experience with our tech stack.",
          "How do you stay updated with industry trends?"
        ];
        setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);
      }, 2000);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  // Start interview
  const handleStartInterview = async () => {
    if (candidateId && jobId) {
      try {
        await dispatch(startInterviewSessionAsync({ candidateId, jobId }));
        startInterview(sessionId!);
        setCurrentQuestion("Tell me about yourself and your experience.");
      } catch (error) {
        console.error('Error starting interview:', error);
      }
    }
  };

  // End interview
  const handleEndInterview = async () => {
    if (sessionId) {
      try {
        await dispatch(endInterviewSessionAsync(sessionId));
        endInterview(sessionId);
        onEnd?.();
      } catch (error) {
        console.error('Error ending interview:', error);
      }
    }
  };

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                currentSession.status === 'LIVE' ? 'bg-green-500 animate-pulse' : 
                currentSession.status === 'READY' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
              <span className="font-medium text-gray-900">
                {currentSession.status === 'LIVE' ? 'Live Interview' : 
                 currentSession.status === 'READY' ? 'Ready to Start' : 'Ended'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Session: {formatTime(sessionTime)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className={`p-2 rounded-lg ${showTranscript ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAvatar(!showAvatar)}
              className={`p-2 rounded-lg ${showAvatar ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <Users className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 text-gray-600 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Avatar/Video Area */}
        {showAvatar && (
          <div className="w-1/2 p-6">
            <div className="bg-white rounded-lg shadow-lg h-full flex items-center justify-center">
              <Avatar2D size={{ width: 300, height: 400 }} showControls={false} />
            </div>
          </div>
        )}

        {/* Interview Interface */}
        <div className={`${showAvatar ? 'w-1/2' : 'w-full'} p-6 flex flex-col`}>
          {/* Current Question */}
          {currentQuestion && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Current Question</h3>
              <p className="text-gray-700">{currentQuestion}</p>
            </div>
          )}

          {/* Answer Input */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 flex-1">
            <h3 className="font-semibold text-gray-900 mb-4">Your Answer</h3>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here or use voice recording..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isRecording 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                </button>
                
                {isRecording && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-600">Recording...</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className={`p-2 rounded-lg ${isAudioEnabled ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'}`}
                >
                  {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`p-2 rounded-lg ${isVideoEnabled ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'}`}
                >
                  {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                {currentSession.status === 'READY' && (
                  <button
                    onClick={handleStartInterview}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    Start Interview
                  </button>
                )}
                
                {currentSession.status === 'LIVE' && (
                  <button
                    onClick={handleEndInterview}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                  >
                    End Interview
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Panel */}
        {showTranscript && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Transcript</h3>
            <div className="space-y-3">
              {transcript.map((entry, index) => (
                <div key={index} className="text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium ${
                      entry.speaker === 'interviewer' ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {entry.speaker === 'interviewer' ? 'Interviewer' : 'You'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{entry.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal (shown after interview ends) */}
      {feedback && currentSession.status === 'COMPLETED' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Feedback</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Technical Skills:</span>
                <span className="font-medium">{feedback.technical}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Communication:</span>
                <span className="font-medium">{feedback.communication}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overall Score:</span>
                <span className="font-medium">{feedback.overall}/100</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-gray-700">{feedback.comments}</p>
              </div>
            </div>
            <button
              onClick={onEnd}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
