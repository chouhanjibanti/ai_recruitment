import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Mic, Settings, ArrowRight } from 'lucide-react';

const InterviewDemoPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartInterview = () => {
    navigate('/candidate/interview');
  };

  const handleQuickStart = () => {
    navigate('/candidate/interview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">AI Interview Experience</h1>
            <button
              onClick={handleQuickStart}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Quick Start
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Your AI Interviewer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience an intelligent conversation with our AI-powered interviewer avatar. 
            Get real-time feedback and a personalized interview experience.
          </p>
        </div>

        {/* Avatar Preview Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Avatar Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mic className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-semibold">AI Interviewer</p>
                  </div>
                </div>
                
                {/* Status Indicator */}
                <div className="absolute -top-2 -right-2 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                  Ready
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">What Makes It Special</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Mic className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Natural Conversation</h4>
                      <p className="text-gray-600">Speak naturally with our AI that understands context and provides relevant questions</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Play className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Real-time Feedback</h4>
                      <p className="text-gray-600">Get instant evaluation and personalized interview experience</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Settings className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Adaptive Questions</h4>
                      <p className="text-gray-600">Questions adapt based on your responses and skill level</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleStartInterview}
                className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Interview with AI Avatar
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={handleQuickStart}>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Interview</h3>
            <p className="text-gray-600 mb-4">Jump straight into a demo interview session</p>
            <div className="text-blue-600 font-medium flex items-center">
              Start Now <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Setup</h3>
            <p className="text-gray-600 mb-4">Test your microphone and audio settings</p>
            <div className="text-green-600 font-medium flex items-center">
              Configure <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600 mb-4">Customize your interview experience</p>
            <div className="text-purple-600 font-medium flex items-center">
              Customize <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Use the AI Avatar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h4>
              <ol className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">1.</span>
                  <span>Click "Start Interview" to begin the session</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">2.</span>
                  <span>Allow microphone access when prompted by your browser</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">3.</span>
                  <span>Listen to the AI avatar's question carefully</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">4.</span>
                  <span>Click and hold the microphone button to speak</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">5.</span>
                  <span>Release the button to stop recording and submit your answer</span>
                </li>
              </ol>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Tips for Best Experience</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Use Chrome or Edge for best speech recognition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Find a quiet environment for clear audio</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Speak clearly and at a moderate pace</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Test your microphone before starting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Take your time to think before answering</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDemoPage;
