# AI Interview Avatar Implementation

## Overview

This document describes the implementation of a lightweight 2D AI interviewer avatar for the candidate interview screen. The system integrates with the Live AI Interview API (Module 2) and provides a complete turn-based interview experience.

## 🎯 Features Implemented

### Core Features
- ✅ **2D Animated Avatar** using HTML5 Canvas
- ✅ **Avatar States**: IDLE, SPEAKING, LISTENING, PROCESSING, ERROR
- ✅ **Text-to-Speech (TTS)** for playing interview questions
- ✅ **Speech-to-Text (STT)** for capturing candidate responses
- ✅ **Push-to-Talk** interview flow
- ✅ **Real-time question display**
- ✅ **Interview progress tracking**
- ✅ **Audio controls and settings**

### Integration Features
- ✅ **Module 2 API Integration** via REST
- ✅ **Session management** with interview service
- ✅ **Turn-based conversation flow**
- ✅ **Error handling and recovery**
- ✅ **Responsive design** for all screen sizes

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── AIAvatar.tsx              # 2D animated avatar component
│   └── InterviewDemo.tsx         # Demo landing page
├── pages/
│   └── candidate/
│       └── InterviewScreen.tsx   # Main interview interface
├── services/
│   └── audioService.ts           # TTS/STT service
├── hooks/
│   └── useInterview.ts           # Interview state management
└── types/
    └── speech.d.ts               # Web Speech API types
```

### Data Flow
```
1. Interview Start → Module 2 API → First Question
2. Question Text → TTS → Audio Playback → Avatar SPEAKING
3. Avatar LISTENING → STT → Transcript → Module 2 API
4. Backend Processing → Avatar PROCESSING → Next Question
5. Repeat until completion → Interview Report
```

## 🎨 Avatar Implementation

### Canvas-based 2D Animation
The avatar is rendered using HTML5 Canvas with the following features:

#### Visual Elements
- **Circular head** with dynamic colors based on state
- **Animated eyes** that respond to avatar state
- **Dynamic mouth** animation for speaking/listening
- **Processing indicator** for thinking state
- **Error state** with red coloring

#### State Animations
```typescript
// SPEAKING: Animated mouth, blinking eyes
// LISTENING: Open mouth, moving eyes
// PROCESSING: Rotating ring around avatar
// ERROR: Red background, static expression
// IDLE: Normal state, minimal animation
```

### Avatar States
```typescript
enum AvatarState {
  IDLE = 'idle',        // Ready state
  SPEAKING = 'speaking', // Playing question audio
  LISTENING = 'listening', // Waiting for response
  PROCESSING = 'processing', // Backend processing
  ERROR = 'error'       // Error occurred
}
```

## 🎵 Audio Service

### Text-to-Speech (TTS)
- Uses Web Speech API's `SpeechSynthesis`
- Configurable voice, rate, pitch, and volume
- Fallback to browser default voices
- Audio URL support for pre-recorded audio

### Speech-to-Text (STT)
- Uses Web Speech API's `SpeechRecognition`
- Real-time transcript generation
- Confidence scoring
- Interim and final results
- Language configuration support

### Browser Compatibility
- **Chrome**: Full support for both TTS and STT
- **Edge**: Full support for both TTS and STT
- **Firefox**: TTS supported, STT limited
- **Safari**: TTS supported, STT not supported

## 🔄 Interview Flow

### 1. Session Initialization
```typescript
// Start interview session
const result = await startInterview({
  resume_id: 'resume_id',
  job_id: 'job_id',
  interview_mode: 'mixed',
  // ... config
});
```

### 2. Question Playback
```typescript
// Play question audio
if (question.audio_url) {
  await playAudioFromUrl(question.audio_url, volume);
} else {
  await speakText(question.question, { volume });
}
```

### 3. Response Capture
```typescript
// Start speech recognition
await startSpeechRecognition(
  (result) => {
    setTranscript(result.transcript);
    if (result.isFinal) {
      setCurrentAnswer(result.transcript);
    }
  }
);
```

### 4. Answer Submission
```typescript
// Submit to backend
await submitAnswer(transcript, question_id);
```

### 5. Next Question
```typescript
// Get next question
await getNextQuestion();
```

## 🔌 Module 2 API Integration - Complete Endpoints

### Base URL Configuration
```bash
# Module 2 API (Live AI Interview)
VITE_INTERVIEW_API=http://localhost:3003/v1

# WebSocket (optional for real-time updates)
VITE_WEBSOCKET_URL=ws://localhost:3004/ws
```

### Complete Interview Flow with API Endpoints

#### **1. Interview Start → Module 2 API → First Question**

**Endpoint:** `POST /v1/interview/start`

**Request:**
```typescript
const startInterviewRequest = {
  resume_id: "res_1234567890",
  job_id: "job_1234567890",
  interview_mode: "mixed", // "technical" | "behavioral" | "mixed"
  recruiter_custom_questions: [ 
    {
      question: "What's your experience with React?",
      type: "technical"
    }
  ],
  interview_config: {
    duration_minutes: 45,
    difficulty_level: "mid", // "easy" | "mid" | "hard"
    focus_areas: ["technical", "behavioral"],
    language: "english"
  }
};

// API Call
const response = await fetch(`${VITE_INTERVIEW_API}/interview/start`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(startInterviewRequest)
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "int_session_1234567890",
    "status": "active",
    "started_at": "2024-02-02T10:30:00Z",
    "current_question": {
      "question_id": "q_001",
      "type": "technical",
      "question": "Tell me about your experience with React development.",
      "audio_url": "https://api.example.com/audio/q_001.mp3",
      "max_response_time": 120,
      "difficulty": "mid"
    },
    "progress": {
      "questions_completed": 0,
      "total_questions": 10,
      "time_elapsed_minutes": 0
    }
  }
}
```

#### **2. Question Text → TTS → Audio Playback → Avatar SPEAKING**

**Frontend Implementation:**
```typescript
// Play question using TTS or pre-recorded audio
const playQuestion = async (question: any) => {
  setAvatarState(AvatarState.SPEAKING);
  
  if (question.audio_url) {
    // Use pre-recorded audio from backend
    await audioService.playAudioFromUrl(question.audio_url, volume);
  } else {
    // Use browser TTS as fallback
    await audioService.speakText(question.question, { volume });
  }
  
  setAvatarState(AvatarState.LISTENING);
};
```

#### **3. Avatar LISTENING → STT → Transcript → Module 2 API**

**Endpoint:** `POST /v1/interview/submit-answer`

**STT Process:**
```typescript
// Start speech recognition
const transcript = await audioService.startSpeechRecognition(
  (result) => {
    setTranscript(result.transcript);
    if (result.isFinal) {
      setCurrentAnswer(result.transcript);
    }
  }
);
```

**Submit Answer API Call:**
```typescript
const submitAnswerRequest = {
  session_id: "int_session_1234567890",
  question_id: "q_001",
  answer: "I have been working with React for 3 years, building complex applications...",
  answer_metadata: {
    response_time_seconds: 45,
    confidence_score: 0.92,
    audio_duration: 42
  }
};

const response = await fetch(`${VITE_INTERVIEW_API}/interview/submit-answer`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(submitAnswerRequest)
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer_id": "ans_001",
    "status": "processing",
    "transcript": "I have been working with React for 3 years...",
    "confidence_score": 0.92,
    "preliminary_feedback": {
      "relevance": 0.85,
      "completeness": 0.78,
      "technical_accuracy": 0.90
    }
  }
}
```

#### **4. Backend Processing → Avatar PROCESSING → Next Question**

**Endpoint:** `GET /v1/interview/next-question`

**API Call:**
```typescript
const response = await fetch(
  `${VITE_INTERVIEW_API}/interview/next-question?session_id=int_session_1234567890`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "int_session_1234567890",
    "status": "active",
    "current_question": {
      "question_id": "q_002",
      "type": "behavioral",
      "question": "Describe a challenging situation you faced at work and how you handled it.",
      "audio_url": "https://api.example.com/audio/q_002.mp3",
      "max_response_time": 150,
      "difficulty": "mid"
    },
    "previous_answer_feedback": {
      "answer_id": "ans_001",
      "score": 0.84,
      "strengths": ["Good technical knowledge", "Clear communication"],
      "improvements": ["Could provide more specific examples"]
    },
    "progress": {
      "questions_completed": 1,
      "total_questions": 10,
      "time_elapsed_minutes": 3
    }
  }
}
```

#### **5. Repeat until completion → Interview Report**

**Endpoint:** `POST /v1/interview/finish`

**API Call:**
```typescript
const finishInterviewRequest = {
  session_id: "int_session_1234567890",
  completion_reason: "completed", // "completed" | "timeout" | "user_ended"
  final_notes: "Candidate performed well overall"
};

const response = await fetch(`${VITE_INTERVIEW_API}/interview/finish`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(finishInterviewRequest)
});
```

**Final Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "int_session_1234567890",
    "status": "completed",
    "completed_at": "2024-02-02T11:15:00Z",
    "final_report": {
      "overall_score": 0.87,
      "technical_score": 0.92,
      "behavioral_score": 0.82,
      "communication_score": 0.85,
      "recommendation": "proceed_to_next_round",
      "strengths": [
        "Strong technical foundation",
        "Good problem-solving skills",
        "Clear communication"
      ],
      "improvements": [
        "Could provide more specific examples",
        "Consider elaborating on project impact"
      ],
      "detailed_feedback": {
        "questions_answered": 10,
        "average_response_time": 85,
        "confidence_score": 0.89
      }
    },
    "next_steps": {
      "recommended_action": "schedule_technical_interview",
      "follow_up_required": true
    }
  }
}
```

### Additional Supporting Endpoints

#### **Get Interview Session Status**
```typescript
GET /v1/interview/session/{session_id}
```

#### **Pause/Resume Interview**
```typescript
POST /v1/interview/pause
POST /v1/interview/resume
```

#### **Get Interview History**
```typescript
GET /v1/interview/history?candidate_id={candidate_id}
```

#### **Interview Configuration**
```typescript
GET /v1/interview/config/{job_id}
PUT /v1/interview/config/{job_id}
```

### Error Handling

#### Common Error Responses
```json
{
  "success": false,
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "Interview session not found or expired",
    "details": "Session int_session_1234567890 has expired"
  }
}
```

#### Error Codes
- `SESSION_NOT_FOUND`: Interview session doesn't exist
- `SESSION_EXPIRED`: Session has timed out
- `INVALID_ANSWER`: Answer format is invalid
- `MICROPHONE_ERROR`: Audio recording failed
- `PROCESSING_ERROR`: Backend processing error
- `RATE_LIMIT_EXCEEDED`: Too many requests

### WebSocket Integration (Optional)

#### Real-time Updates
```typescript
// Connect to WebSocket for real-time updates
const ws = new WebSocket(`${VITE_WEBSOCKET_URL}?session_id=${session_id}`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'processing_status':
      setAvatarState(AvatarState.PROCESSING);
      break;
    case 'next_question_ready':
      getNextQuestion();
      break;
    case 'interview_completed':
      navigate('/candidate/interview-complete');
      break;
  }
};
```

#### WebSocket Message Types
- `processing_status`: Backend processing updates
- `next_question_ready`: Next question available
- `interview_completed`: Interview finished
- `error`: Error occurred during processing

### Integration with Avatar States

```typescript
// Complete flow with avatar state management
const interviewFlow = async () => {
  try {
    // 1. Start interview
    setAvatarState(AvatarState.PROCESSING);
    const session = await startInterview();
    
    // 2. Play first question
    await playQuestion(session.current_question);
    // Avatar state: SPEAKING → LISTENING
    
    // 3. Capture response
    const transcript = await captureResponse();
    // Avatar state: LISTENING → PROCESSING
    
    // 4. Submit answer
    await submitAnswer(transcript);
    
    // 5. Get next question
    const nextQuestion = await getNextQuestion();
    // Repeat until completion
    
  } catch (error) {
    setAvatarState(AvatarState.ERROR);
  }
};
```

## 🎮 User Interface

### Main Components

#### AIAvatar Component
- **Canvas rendering** for smooth animations
- **State indicators** with color coding
- **Interactive controls** for recording and skipping
- **Volume control** slider
- **Contextual instructions** based on state

#### InterviewScreen Component
- **Avatar integration** with full state management
- **Transcript display** for real-time feedback
- **Progress tracking** with visual indicators
- **Timer display** for response limits
- **Audio settings** panel

### Responsive Design
- **Mobile**: Stacked layout, larger controls
- **Tablet**: Side-by-side layout, optimized spacing
- **Desktop**: Full three-column layout

## 🔧 Configuration

### Environment Variables
```bash
# Module 2 API
VITE_INTERVIEW_API=http://localhost:3003/v1

# WebSocket (optional)
VITE_WEBSOCKET_URL=ws://localhost:3004/ws
```

### Audio Settings
```typescript
const audioConfig = {
  volume: 0.8,           // Default volume (0-1)
  rate: 1.0,             // Speech rate
  pitch: 1.0,            // Speech pitch
  language: 'en-US',     // Recognition language
  maxRecordingTime: 30000 // Max recording in ms
};
```

## 🚀 Getting Started

### 1. Navigate to Interview
```bash
# Direct access
http://localhost:3000/candidate/interview

# Via demo page
http://localhost:3000/candidate/interview-demo
```

### 2. Allow Microphone Access
- Browser will request microphone permission
- Click "Allow" to enable speech recognition
- Grant permission for best experience

### 3. Start Interview
- Click "Start Demo Interview" on demo page
- Or navigate directly to interview screen
- Avatar will initialize and start first question

### 4. Participate in Interview
- Listen to questions carefully
- Click and hold microphone to speak
- Release to stop recording
- Wait for processing and next question

## 🛠️ Technical Implementation

### Key Technologies
- **React 18** with TypeScript
- **HTML5 Canvas** for avatar rendering
- **Web Speech API** for TTS/STT
- **TailwindCSS** for styling
- **Lucide React** for icons

### State Management
- **useInterview** hook for interview state
- **Local state** for avatar and audio
- **Redux integration** for global state
- **Session persistence** via API

### Error Handling
- **Graceful degradation** for unsupported browsers
- **Retry mechanisms** for network failures
- **User feedback** for all error states
- **Fallback options** for audio issues

## 📱 Browser Support

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| TTS | ✅ | ✅ | ✅ | ✅ |
| STT | ✅ | ✅ | ⚠️ | ❌ |
| Canvas | ✅ | ✅ | ✅ | ✅ |
| Audio | ✅ | ✅ | ✅ | ✅ |

**⚠️ Firefox**: Limited STT support
**❌ Safari**: No STT support

## 🔍 Testing

### Manual Testing
1. **Avatar Animation**: Verify all states work correctly
2. **Audio Playback**: Test TTS with different voices
3. **Speech Recognition**: Test STT with various accents
4. **API Integration**: Verify Module 2 communication
5. **Error Handling**: Test network failures and permissions

### Automated Testing
```bash
# Run TypeScript checks
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test
```

## 🚨 Troubleshooting

### Common Issues

#### Microphone Not Working
- Check browser permissions
- Ensure HTTPS (required for microphone)
- Try different browser (Chrome/Edge recommended)
- Check system microphone settings

#### Speech Recognition Not Available
- Use Chrome or Edge browser
- Check if Web Speech API is supported
- Verify internet connection
- Try refreshing the page

#### Avatar Not Animating
- Check browser console for errors
- Verify Canvas support
- Check if component is mounting correctly
- Ensure proper state management

#### Audio Not Playing
- Check browser audio settings
- Verify volume controls
- Check for autoplay restrictions
- Ensure TTS voices are available

### Debug Mode
Enable debug logging by setting:
```typescript
const DEBUG = true;
```

This will log detailed information to the console.

## 📈 Performance

### Optimization Techniques
- **Canvas optimization** with requestAnimationFrame
- **Audio caching** for repeated playback
- **Debounced speech recognition**
- **Lazy loading** of audio resources
- **Memory management** for audio streams

### Metrics
- **Avatar FPS**: 60fps target
- **Audio Latency**: <100ms
- **Speech Recognition**: <500ms
- **API Response**: <2s

## 🔮 Future Enhancements

### Planned Features
- **3D Avatar** with Three.js
- **Emotion Recognition** from facial expressions
- **Advanced NLP** for better understanding
- **Multi-language Support**
- **Voice Cloning** for personalized experience
- **Real-time Collaboration** for panel interviews

### Integration Opportunities
- **Video Interview** integration
- **Code Assessment** for technical roles
- **Personality Analysis** using AI
- **Skill Assessment** integration
- **ATS Integration** for seamless workflow

## 📞 Support

### Documentation
- **API Documentation**: See `fieldapiendpoint.md`
- **Component Documentation**: Inline JSDoc comments
- **Integration Guide**: See `DASHBOARD_INTEGRATION.md`

### Contact
- **Frontend Team**: [Your contact info]
- **Backend Teams**: Module 1 & Module 2 teams
- **Support**: Create GitHub issue

---

## 🎉 Summary

The AI Interview Avatar implementation provides a complete, production-ready solution for conducting AI-powered interviews. With its lightweight 2D avatar, robust audio handling, and seamless API integration, it offers an engaging and effective interview experience for candidates while providing valuable insights to recruiters.

The system is designed to be extensible, maintainable, and user-friendly, with proper error handling and browser compatibility considerations. It successfully bridges the gap between traditional interviews and AI-powered assessment tools.
