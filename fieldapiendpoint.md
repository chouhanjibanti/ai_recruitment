# API Endpoints Required for Frontend Dashboard

## Overview
This document lists all the API endpoints that need to be implemented by the backend teams (Module 1: Resume Parser and Module 2: Interview API) for the frontend dashboard to function properly.

---

## MODULE 1: Resume Parser API Endpoints

### Base URL: `http://localhost:3002/v1`

### 1. Upload Resume Document
**Endpoint:** `POST /v1/resume/upload`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (binary data)

**Response Format:**
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

**Response Format:**
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

**URL Parameters:**
- `resume_id` (string): The ID of the resume to retrieve

**Response Format:**
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
    "raw_text": "John Doe\nSenior Software Engineer\nEmail: john.doe@email.com\nPhone: +1-234-567-8900\n\nSummary:\nExperienced software engineer with expertise in...",
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

**Response Format:**
```json
{
  "success": true,
  "data": {
    "resume_id": "res_1234567890",
    "new_parse_id": "parse_002",
    "parsed_profile": {
      // Updated parsed profile
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

## MODULE 2: Live AI Interview API Endpoints

### Base URL: `http://localhost:3003/v1/interview/live`

### 1. Start Live Interview
**Endpoint:** `POST /v1/interview/live/start`

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

**Response Format:**
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

**Response Format:**
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

**Request:**
```json
{
  "session_id": "int_session_1234567890",
  "force_next": false
}
```

**Response Format:**
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

**Request:**
```json
{
  "session_id": "int_session_1234567890",
  "question_id": "q_002"
}
```

**Response Format:**
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

**Request:**
```json
{
  "session_id": "int_session_1234567890",
  "finish_reason": "completed",
  "candidate_notes": "Candidate performed well, strong technical skills"
}
```

**Response Format:**
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

**URL Parameters:**
- `session_id` (string): The ID of the interview session

**Response Format:**
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

## ADDITIONAL ENDPOINTS NEEDED

### Health Check Endpoints (Both Modules)
**Module 1:** `GET /v1/health`
**Module 2:** `GET /v1/interview/live/health`

**Response Format:**
```json
{
  "status": "healthy",
  "timestamp": "2024-02-02T10:30:00Z",
  "version": "1.0.0",
  "uptime": "2 days, 5 hours"
}
```

### Analytics Endpoints (For Admin Dashboard)
**Module 1:** `GET /v1/analytics/resume-parsing`
**Module 2:** `GET /v1/interview/live/analytics`

**Response Format:**
```json
{
  "success": true,
  "data": {
    "total_processed": 1250,
    "success_rate": 0.92,
    "average_processing_time": 2.3,
    "daily_stats": [
      {
        "date": "2024-02-01",
        "count": 45,
        "success_rate": 0.94
      }
    ]
  }
}
```

---
## AUTHENTICATION REQUIREMENTS

All endpoints must support JWT authentication:
- Header: `Authorization: Bearer <jwt_token>`
- Token validation
- User role verification (admin, recruiter, candidate)

---

## ERROR HANDLING STANDARDS

All endpoints must return consistent error responses:
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

---

## RATE LIMITING

- Resume parsing: 10 requests per minute per user
- Interview operations: 60 requests per minute per session
- File uploads: 5 uploads per minute per user

---

## IMPLEMENTATION PRIORITY

### High Priority (Core Functionality)
1. Module 1: Upload Resume
2. Module 1: Parse Resume
3. Module 2: Start Interview
4. Module 2: Submit Answer
5. Module 2: Get Interview Report

### Medium Priority (Enhanced Features)
6. Module 1: Get Resume Details
7. Module 1: Re-parse Resume
8. Module 2: Get Next Question
9. Module 2: Repeat Question
10. Module 2: Finish Interview

### Low Priority (Analytics & Monitoring)
11. Health Check endpoints
12. Analytics endpoints
13. Error logging and monitoring

---

## TESTING REQUIREMENTS

Each endpoint should have:
- Unit tests
- Integration tests
- Error scenario tests
- Performance tests (for file uploads and AI processing)

---

## FRONTEND DEPENDENCIES

The frontend dashboard depends on these exact endpoint structures. Any changes to the response formats must be coordinated with the frontend team to avoid breaking changes.

**Frontend Team Contact:** [Your contact info]
**Backend Teams:** Module 1 Team, Module 2 Team
