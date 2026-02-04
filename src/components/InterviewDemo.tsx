import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Mic, Settings } from 'lucide-react';

const InterviewDemo: React.FC = () => {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    navigate('/candidate/interview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Interview Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of recruitment with our AI-powered interview system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Mic className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Interaction</h3>
            <p className="text-gray-600 text-center">
              Natural conversation with our AI interviewer using speech recognition
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Feedback</h3>
            <p className="text-gray-600 text-center">
              Get instant evaluation and personalized interview experience
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Questions</h3>
            <p className="text-gray-600 text-center">
              Questions adapt based on your responses and skill level
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStartInterview}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Play className="w-6 h-6 mr-2" />
            Start Demo Interview
          </button>
          
          <p className="mt-4 text-sm text-gray-600">
            This is a demo version. No actual interview will be conducted.
          </p>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Before You Start</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Use Chrome or Edge for best speech recognition
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Allow microphone access when prompted
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Find a quiet environment for clear audio
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Test your microphone before starting
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">During the Interview</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Listen carefully to each question
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Click and hold microphone to speak
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Speak clearly and at a moderate pace
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Take your time to think before answering
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDemo;
