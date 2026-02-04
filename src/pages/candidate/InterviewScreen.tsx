import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AIAvatar, { AvatarState } from '../../components/AIAvatar';
import { useInterview } from '../../hooks/useInterview';
import { useAudioService } from '../../services/audioService';
import { interviewService } from '../../services/interviewService';
import { Clock, MessageSquare, Volume2, Settings } from 'lucide-react';

interface InterviewQuestion {
  question_id: string;
  type: 'technical' | 'behavioral' | 'problem_solving';
  question: string;
  audio_url?: string;
  max_response_time: number;
}

const InterviewScreen: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  // Interview state
  const {
    session,
    currentAnswer,
    submitting,
    evaluation,
    startInterview,
    submitAnswer,
    getNextQuestion,
    finishInterview,
    setCurrentAnswer,
  } = useInterview(sessionId);

  // Audio service
  const {
    speakText,
    startSpeechRecognition,
    stopSpeechRecognition,
    playAudioFromUrl,
    isSpeechRecognitionSupported,
    getAvailableVoices,
  } = useAudioService();

  // Local state
  const [avatarState, setAvatarState] = useState<AvatarState>(AvatarState.IDLE);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [transcript, setTranscript] = useState('');
  const [volume, setVolume] = useState(0.8);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [interviewStarted, setInterviewStarted] = useState(false);

  // Refs
  const recognitionRef = useRef<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Initialize interview
  useEffect(() => {
    if (!sessionId && !interviewStarted) {
      // Start a new interview (this would normally come from job selection)
      handleStartInterview();
    }
  }, [sessionId, interviewStarted]);

  // Handle question changes
  useEffect(() => {
    if (session?.current_question && !currentQuestion) {
      setCurrentQuestion(session.current_question);
      playQuestion(session.current_question);
    }
  }, [session?.current_question]);

  // Timer for response time
  useEffect(() => {
    if (timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRecording) {
      handleStopRecording();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, isRecording]);

  const handleStartInterview = async () => {
    try {
      setAvatarState(AvatarState.PROCESSING);
      
      // Mock interview start - in real app, this would use actual job and resume data
      const result = await startInterview({
        resume_id: 'demo_resume_id',
        job_id: 'demo_job_id',
        interview_mode: 'mixed',
        recruiter_custom_questions: [],
        interview_config: {
          duration_minutes: 45,
          difficulty_level: 'mid',
          focus_areas: ['technical', 'behavioral'],
          language: 'english',
        },
      });

      setInterviewStarted(true);
      setAvatarState(AvatarState.IDLE);
    } catch (error) {
      console.error('Failed to start interview:', error);
      setAvatarState(AvatarState.ERROR);
    }
  };

  const playQuestion = async (question: InterviewQuestion) => {
    try {
      setAvatarState(AvatarState.SPEAKING);
      
      // Play audio if available, otherwise use TTS
      if (question.audio_url) {
        await playAudioFromUrl(question.audio_url, volume);
      } else {
        await speakText(question.question, { volume });
      }
      
      setAvatarState(AvatarState.LISTENING);
      setTimeRemaining(question.max_response_time);
    } catch (error) {
      console.error('Failed to play question:', error);
      setAvatarState(AvatarState.ERROR);
    }
  };

  const handleStartRecording = async () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    try {
      setIsRecording(true);
      setTranscript('');
      recognitionRef.current = true;

      await startSpeechRecognition(
        (result) => {
          setTranscript(result.transcript);
          if (result.isFinal) {
            setCurrentAnswer(result.transcript);
          }
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setAvatarState(AvatarState.ERROR);
          setIsRecording(false);
          recognitionRef.current = false;
        }
      );
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setAvatarState(AvatarState.ERROR);
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      recognitionRef.current = false;
      stopSpeechRecognition();
      
      if (transcript.trim()) {
        setAvatarState(AvatarState.PROCESSING);
        await submitAnswer(transcript, currentQuestion?.question_id || '');
        setTranscript('');
        setCurrentAnswer('');
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      setAvatarState(AvatarState.ERROR);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleSkipQuestion = async () => {
    try {
      setAvatarState(AvatarState.PROCESSING);
      await getNextQuestion();
    } catch (error) {
      console.error('Failed to skip question:', error);
      setAvatarState(AvatarState.ERROR);
    }
  };

  const handleFinishInterview = async () => {
    try {
      setAvatarState(AvatarState.PROCESSING);
      await finishInterview('completed');
      navigate('/candidate/interview-complete');
    } catch (error) {
      console.error('Failed to finish interview:', error);
      setAvatarState(AvatarState.ERROR);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session && !interviewStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Starting interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">AI Interview</h1>
              {session && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Question {session.progress.questions_completed + 1} of {session.progress.total_questions}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer */}
              {timeRemaining > 0 && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  timeRemaining < 30 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{formatTime(timeRemaining)}</span>
                </div>
              )}
              
              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
              
              {/* End Interview */}
              <button
                onClick={handleFinishInterview}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="lg:col-span-2">
            <AIAvatar
              state={avatarState}
              question={currentQuestion?.question}
              isRecording={isRecording}
              onToggleRecording={handleToggleRecording}
              onSkipQuestion={handleSkipQuestion}
              volume={volume}
            />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Transcript */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Response</h3>
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                {transcript ? (
                  <p className="text-gray-800">{transcript}</p>
                ) : (
                  <p className="text-gray-500 italic">
                    {isRecording ? 'Listening...' : 'Your response will appear here...'}
                  </p>
                )}
              </div>
            </div>

            {/* Interview Progress */}
            {session && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Questions Completed</span>
                    <span className="font-medium">{session.progress.questions_completed}/{session.progress.total_questions}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(session.progress.questions_completed / session.progress.total_questions) * 100}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time Elapsed</span>
                    <span className="font-medium">{session.progress.time_elapsed_minutes}m</span>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Audio</h3>
                <Volume2 className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{Math.round(volume * 100)}%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>• Click and hold microphone for push-to-talk</p>
                  <p>• Click once for continuous recording</p>
                  <p>• Speech recognition: {isSpeechRecognitionSupported() ? 'Available' : 'Not supported'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScreen;
