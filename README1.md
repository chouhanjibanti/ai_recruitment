# AI Recruitment Platform - API Documentation

## Overview

Production-grade FastAPI backend for AI recruitment platform with two strictly separated modules:

- **Module 1: Resume Parser API** - Document processing and candidate profile extraction
- **Module 2: Live AI Interview API** - State-machine based interview system

## Architecture Rules

- Resume parsing must complete before interview starts
- Interview questions must be generated using parsed resume JSON
- APIs must be deterministic and dashboard-friendly
- All responses must be structured JSON
- Session state must be persistent and recoverable

---

## MODULE 1: Resume Parser API

### 1. Upload Resume Document

**Endpoint:** `POST /v1/resume/upload`

**Description:** Upload resume file (PDF/DOCX/TXT) and store for processing

**Request:**
```http
Content-Type: multipart/form-data

file: [binary file data]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resume_id": "res_1234567890",
    "filename": "john_doe_resume.pdf",
    "file_size": 2048576,
    "file_type": "application/pdf",
    "upload_timestamp": "2024-02-02T10:30:00Z",
    "status": "uploaded"
  },
  "message": "Resume uploaded successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only PDF, DOCX, and TXT files are supported"
  }
}
```

---

### 2. Parse Resume

**Endpoint:** `POST /v1/resume/parse`

**Description:** Run deterministic NLP extraction on uploaded resume

**Request:**
```json
{
  "resume_id": "res_1234567890",
  "parsing_options": {
    "extract_skills": true,
    "extract_experience": true,
    "extract_education": true,
    "extract_projects": true,
    "confidence_threshold": 0.7
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resume_id": "res_1234567890",
    "parsed_profile": {
      "personal_info": {
        "name": "John Doe",
        "email": "john.doe@email.com",
        "phone": "+1-234-567-8900",
        "location": "San Francisco, CA",
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe"
      },
      "summary": "Senior Software Engineer with 8+ years of experience...",
      "skills": {
        "technical": ["Python", "JavaScript", "React", "AWS", "Docker"],
        "soft": ["Leadership", "Communication", "Problem Solving"],
        "certifications": ["AWS Certified Solutions Architect"]
      },
      "experience": [
        {
          "company": "Tech Corp",
          "position": "Senior Software Engineer",
          "duration": "2020-01 - Present",
          "description": "Led development of microservices architecture...",
          "achievements": ["Reduced latency by 40%", "Scaled to 1M+ users"]
        }
      ],
      "education": [
        {
          "institution": "Stanford University",
          "degree": "Master of Science in Computer Science",
          "year": "2016",
          "gpa": "3.8"
        }
      ],
      "projects": [
        {
          "name": "AI Chatbot",
          "description": "Built conversational AI using NLP",
          "technologies": ["Python", "TensorFlow", "React"],
          "duration": "2023-01 - 2023-06"
        }
      ]
    },
    "parsing_metadata": {
      "confidence_score": 0.92,
      "missing_fields": ["cover_letter", "references"],
      "warnings": [
        "No graduation year found for Bachelor's degree",
        "Phone number format may be invalid"
      ],
      "processing_time_ms": 1250,
      "parsed_at": "2024-02-02T10:31:30Z"
    }
  },
  "message": "Resume parsed successfully"
}
```

---

### 3. Get Resume Details

**Endpoint:** `GET /v1/resume/{resume_id}`

**Description:** Retrieve raw text and parsed structured profile

**Response:**
```json
{
  "success": true,
  "data": {
    "resume_id": "res_1234567890",
    "file_info": {
      "filename": "john_doe_resume.pdf",
      "file_size": 2048576,
      "file_type": "application/pdf",
      "upload_timestamp": "2024-02-02T10:30:00Z"
    },
    "raw_text": "John Doe\nSenior Software Engineer\nEmail: john.doe@email.com\nPhone: +1-234-567-8900\n\nSummary:\nExperienced software engineer with expertise in...\n\nExperience:\nTech Corp - Senior Software Engineer (2020-Present)\n- Led development of microservices...",
    "parsed_profile": {
      // Same structure as parse response
    },
    "parsing_history": [
      {
        "parse_id": "parse_001",
        "timestamp": "2024-02-02T10:31:30Z",
        "confidence_score": 0.92,
        "version": "1.0"
      }
    ]
  }
}
```

---

### 4. Re-parse Resume

**Endpoint:** `POST /v1/resume/{resume_id}/reparse`

**Description:** Re-run parsing with latest rules and algorithms

**Request:**
```json
{
  "force_reparse": true,
  "parsing_options": {
    "extract_skills": true,
    "extract_experience": true,
    "extract_education": true,
    "extract_projects": true,
    "confidence_threshold": 0.8,
    "use_latest_model": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resume_id": "res_1234567890",
    "new_parse_id": "parse_002",
    "parsed_profile": {
      // Updated parsed profile with new extraction
    },
    "parsing_metadata": {
      "confidence_score": 0.95,
      "missing_fields": ["references"],
      "warnings": [],
      "processing_time_ms": 1100,
      "parsed_at": "2024-02-02T11:15:00Z",
      "changes_from_previous": {
        "skills_added": ["Kubernetes", "GraphQL"],
        "experience_updated": true,
        "confidence_improved": 0.03
      }
    }
  },
  "message": "Resume re-parsed successfully"
}
```

---

## MODULE 2: Live AI Interview API

### 1. Start Live Interview

**Endpoint:** `POST /v1/interview/live/start`

**Description:** Initialize interview session with parsed resume and job requirements

**Request:**
```json
{
  "resume_id": "res_1234567890",
  "job_id": "job_abc123",
  "recruiter_custom_questions": [
    {
      "question": "Describe your experience with cloud architecture",
      "category": "technical",
      "priority": "high"
    }
  ],
  "interview_mode": "technical",
  "interview_config": {
    "duration_minutes": 45,
    "difficulty_level": "senior",
    "focus_areas": ["technical", "behavioral", "problem_solving"],
    "language": "english"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "int_session_1234567890",
    "candidate_profile": {
      "name": "John Doe",
      "experience_years": 8,
      "key_skills": ["Python", "JavaScript", "React", "AWS"],
      "current_role": "Senior Software Engineer"
    },
    "interview_plan": {
      "total_questions": 8,
      "estimated_duration": "45 minutes",
      "categories": {
        "technical": 4,
        "behavioral": 2,
        "problem_solving": 2
      }
    },
    "first_question": {
      "question_id": "q_001",
      "type": "technical",
      "question": "Can you walk me through your experience with microservices architecture and how you've handled scalability challenges?",
      "expected_keywords": ["microservices", "scalability", "load balancing", "caching"],
      "max_response_time": 180,
      "follow_up_suggestions": [
        "What specific challenges did you face?",
        "How did you measure performance improvements?"
      ]
    },
    "session_status": "active",
    "started_at": "2024-02-02T14:00:00Z"
  }
}
```

---

### 2. Submit Answer

**Endpoint:** `POST /v1/interview/live/answer`

**Description:** Evaluate candidate answer and determine next action

**Request:**
```json
{
  "session_id": "int_session_1234567890",
  "question_id": "q_001",
  "transcript": "I have extensive experience with microservices architecture. At my current company, I led the migration from a monolithic application to microservices, which involved breaking down the application into 12 independent services. We implemented API Gateway for routing, used Docker for containerization, and Kubernetes for orchestration. This improved our deployment frequency by 300% and reduced system downtime by 40%.",
  "response_metadata": {
    "response_time_seconds": 45,
    "audio_quality_score": 0.95,
    "speech_clarity_score": 0.88
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "int_session_1234567890",
    "question_id": "q_001",
    "evaluation": {
      "overall_score": 8.5,
      "scores": {
        "relevance": 9.0,
        "depth": 8.0,
        "clarity": 8.5,
        "technical_accuracy": 9.0
      },
      "strengths": [
        "Demonstrated practical experience with microservices",
        "Provided specific metrics and results",
        "Clear explanation of technical concepts"
      ],
      "areas_for_improvement": [
        "Could elaborate more on specific challenges",
        "Missing details about team collaboration"
      ],
      "key_insights": [
        "Strong architectural knowledge",
        "Results-oriented approach",
        "Hands-on implementation experience"
      ]
    },
    "next_action": "continue",
    "next_question": {
      "question_id": "q_002",
      "type": "technical",
      "question": "How do you approach debugging complex production issues? Can you share a specific example?",
      "context": "Follow-up to previous microservices discussion",
      "max_response_time": 120
    },
    "session_progress": {
      "questions_completed": 1,
      "total_questions": 8,
      "time_elapsed_minutes": 3,
      "estimated_remaining_minutes": 42
    }
  }
}
```

---

### 3. Get Next Question

**Endpoint:** `POST /v1/interview/live/next`

**Description:** Retrieve next question based on session state and previous answers

**Request:**
```json
{
  "session_id": "int_session_1234567890",
  "force_next": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "int_session_1234567890",
    "question": {
      "question_id": "q_003",
      "type": "behavioral",
      "question": "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
      "evaluation_criteria": [
        "Conflict resolution",
        "Communication skills",
        "Professionalism",
        "Problem-solving approach"
      ],
      "max_response_time": 150,
      "follow_up_available": true
    },
    "session_context": {
      "current_category": "behavioral",
      "adaptive_difficulty": "medium",
      "candidate_performance_trend": "improving"
    }
  }
}
```

---

### 4. Repeat Current Question

**Endpoint:** `POST /v1/interview/live/repeat`

**Description:** Replay current question for candidate

**Request:**
```json
{
  "session_id": "int_session_1234567890",
  "question_id": "q_002"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "int_session_1234567890",
    "question": {
      "question_id": "q_002",
      "type": "technical",
      "question": "How do you approach debugging complex production issues? Can you share a specific example?",
      "audio_url": "https://api.example.com/audio/q_002.mp3",
      "text_display": true,
      "repeat_count": 1
    },
    "session_status": "active"
  }
}
```

---

### 5. Finish Interview

**Endpoint:** `POST /v1/interview/live/finish`

**Description:** End interview session and generate preliminary report

**Request:**
```json
{
  "session_id": "int_session_1234567890",
  "finish_reason": "completed",
  "candidate_notes": "Candidate performed well, strong technical skills"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "int_session_1234567890",
    "session_summary": {
      "duration_minutes": 42,
      "questions_completed": 7,
      "questions_skipped": 1,
      "overall_score": 8.2,
      "finished_at": "2024-02-02T14:42:00Z"
    },
    "preliminary_results": {
      "technical_score": 8.5,
      "behavioral_score": 7.8,
      "communication_score": 8.0,
      "problem_solving_score": 8.3
    },
    "report_id": "report_1234567890",
    "report_status": "generating"
  },
  "message": "Interview completed successfully. Final report is being generated."
}
```

---

### 6. Get Interview Report

**Endpoint:** `GET /v1/interview/live/{session_id}/report`

**Description:** Retrieve comprehensive recruiter-facing interview report

**Response:**
```json
{
  "success": true,
  "data": {
    "report_id": "report_1234567890",
    "session_id": "int_session_1234567890",
    "candidate_info": {
      "name": "John Doe",
      "resume_id": "res_1234567890",
      "job_id": "job_abc123",
      "interview_date": "2024-02-02T14:00:00Z"
    },
    "overall_assessment": {
      "final_score": 8.2,
      "recommendation": "strong_hire",
      "confidence_level": 0.85,
      "summary": "Candidate demonstrates strong technical expertise and good communication skills. Recommended for senior position."
    },
    "detailed_scores": {
      "technical_skills": {
        "score": 8.5,
        "breakdown": {
          "programming": 9.0,
          "architecture": 8.5,
          "debugging": 8.0,
          "tools": 8.5
        },
        "strengths": ["Microservices architecture", "Cloud technologies", "System design"],
        "weaknesses": ["Limited experience with emerging frameworks"]
      },
      "behavioral_skills": {
        "score": 7.8,
        "breakdown": {
          "teamwork": 8.0,
          "leadership": 7.5,
          "communication": 8.0,
          "problem_solving": 7.5
        },
        "strengths": ["Clear communication", "Team collaboration"],
        "areas_for_improvement": ["Leadership in crisis situations"]
      },
      "communication": {
        "score": 8.0,
        "clarity": 8.5,
        "conciseness": 7.5,
        "professionalism": 8.0
      }
    },
    "question_analysis": [
      {
        "question_id": "q_001",
        "question": "Can you walk me through your experience with microservices architecture?",
        "answer_summary": "Detailed explanation of microservices migration project",
        "score": 8.5,
        "key_points": ["Practical experience", "Specific metrics", "Technical depth"],
        "red_flags": []
      }
    ],
    "strengths": [
      "Strong technical background in relevant technologies",
      "Provides specific examples and metrics",
      "Clear and structured communication",
      "Problem-solving mindset"
    ],
    "weaknesses": [
      "Limited leadership experience examples",
      "Could improve on behavioral question depth"
    ],
    "red_flags": [],
    "full_transcript": {
      "total_duration_minutes": 42,
      "word_count": 1250,
      "questions_count": 7,
      "transcript_url": "https://api.example.com/transcripts/int_session_1234567890.pdf"
    },
    "recommendations": {
      "next_steps": ["Technical interview with team lead", "System design exercise"],
      "salary_range": "$120,000 - $150,000",
      "fit_score": 0.88
    },
    "generated_at": "2024-02-02T14:45:00Z"
  }
}
```

---

## Technical Implementation Details

### Session State Management

**Session Structure:**
```json
{
  "session_id": "int_session_1234567890",
  "resume_id": "res_1234567890",
  "job_id": "job_abc123",
  "status": "active|completed|paused",
  "current_question_id": "q_003",
  "questions_asked": ["q_001", "q_002"],
  "answers": {
    "q_001": {
      "transcript": "...",
      "score": 8.5,
      "timestamp": "2024-02-02T14:05:00Z"
    }
  },
  "session_config": {
    "interview_mode": "technical",
    "difficulty_level": "senior",
    "duration_minutes": 45
  },
  "created_at": "2024-02-02T14:00:00Z",
  "updated_at": "2024-02-02T14:15:00Z"
}
```

### Provider Abstraction

**AI Provider Interface:**
```python
class AIProvider:
    def generate_questions(self, resume_profile, job_requirements, custom_questions)
    def evaluate_answer(self, question, answer, expected_keywords)
    def generate_follow_up(self, question, answer, evaluation)
    def analyze_sentiment(self, transcript)
    def extract_insights(self, session_data)
```

**Supported Providers:**
- OpenAI GPT-4/GPT-3.5
- OpenRouter (multiple models)
- Google Gemini
- Local LLMs (Ollama)

### Error Handling

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": {
      "field": "additional_context",
      "timestamp": "2024-02-02T10:30:00Z"
    }
  }
}
```

**Common Error Codes:**
- `INVALID_RESUME_ID` - Resume not found
- `SESSION_NOT_FOUND` - Interview session not found
- `INVALID_SESSION_STATE` - Invalid operation for current session state
- `PARSING_FAILED` - Resume parsing failed
- `AI_PROVIDER_ERROR` - AI service unavailable
- `VALIDATION_ERROR` - Request validation failed

### Rate Limiting

- Resume parsing: 10 requests per minute
- Interview sessions: 5 sessions per hour
- Answer evaluation: 60 requests per minute

### Authentication

All endpoints require JWT authentication:
```http
Authorization: Bearer <jwt_token>
```

---

## Integration Guide

### Module 1 → Module 2 Flow

1. **Upload Resume** → Get `resume_id`
2. **Parse Resume** → Get structured profile
3. **Start Interview** → Use `resume_id` and parsed profile
4. **Live Interview** → State-based Q&A
5. **Generate Report** → Comprehensive evaluation

### Webhook Support

**Events:**
- `resume.parsed` - Resume parsing completed
- `interview.started` - Interview session started
- `interview.completed` - Interview finished
- `report.generated` - Final report ready

**Webhook Payload:**
```json
{
  "event": "resume.parsed",
  "data": {
    "resume_id": "res_1234567890",
    "confidence_score": 0.92,
    "timestamp": "2024-02-02T10:31:30Z"
  }
}
```

---

## Testing

### Sample Test Data

**Test Resume:** Available at `/test-data/sample_resume.pdf`
**Test Job:** Available at `/test-data/sample_job.json`

### API Testing Scripts

```bash
# Upload and parse resume
curl -X POST "http://localhost:8000/v1/resume/upload" -F "file=@sample_resume.pdf"
curl -X POST "http://localhost:8000/v1/resume/parse" -H "Content-Type: application/json" -d '{"resume_id": "res_1234567890"}'

# Start interview
curl -X POST "http://localhost:8000/v1/interview/live/start" -H "Content-Type: application/json" -d '{"resume_id": "res_1234567890", "job_id": "job_abc123"}'
```

---

## Deployment

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost/recruitment_db
REDIS_URL=redis://localhost:6379

# AI Providers
OPENAI_API_KEY=sk-...
OPENROUTER_API_KEY=sk-or-...
GEMINI_API_KEY=...

# File Storage
AWS_S3_BUCKET=recruitment-resumes
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Security
JWT_SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=http://localhost:3000
```

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Monitoring & Analytics

### Key Metrics

- Resume parsing success rate
- Average parsing time
- Interview completion rate
- Question response quality scores
- AI provider response times
- Session state persistence

### Health Checks

- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status
- `GET /metrics` - Prometheus metrics

---

## Support

For API support and questions:
- Documentation: https://docs.recruitment-api.com
- Support: api-support@company.com
- Status Page: https://status.recruitment-api.com
