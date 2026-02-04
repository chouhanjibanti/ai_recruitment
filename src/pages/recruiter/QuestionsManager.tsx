import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit, Trash2, GripVertical, AlertCircle, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral' | 'situational' | 'knockout';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  points: number;
  isRequired: boolean;
  followUpQuestions: string[];
  createdAt: string;
  updatedAt: string;
}

interface QuestionBank {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  isDefault: boolean;
  createdAt: string;
}

const QuestionsManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [isCreatingBank, setIsCreatingBank] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null);

  // Mock data
  useEffect(() => {
    const mockQuestions: Question[] = [
      {
        id: '1',
        text: 'Describe your experience with React and its core concepts.',
        type: 'technical',
        category: 'Frontend',
        difficulty: 'medium',
        timeLimit: 120,
        points: 10,
        isRequired: true,
        followUpQuestions: ['Can you explain the virtual DOM?', 'What are React hooks?'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        text: 'Tell me about a time you had to deal with a difficult team member.',
        type: 'behavioral',
        category: 'Soft Skills',
        difficulty: 'medium',
        timeLimit: 180,
        points: 15,
        isRequired: false,
        followUpQuestions: ['What was the outcome?', 'What did you learn?'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        text: 'Do you have experience with cloud technologies?',
        type: 'knockout',
        category: 'Infrastructure',
        difficulty: 'easy',
        timeLimit: 30,
        points: 5,
        isRequired: false,
        followUpQuestions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const mockBanks: QuestionBank[] = [
      {
        id: '1',
        name: 'Frontend Developer',
        description: 'Questions for frontend developer positions',
        questions: mockQuestions.filter(q => q.category === 'Frontend'),
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Full Stack Developer',
        description: 'Comprehensive questions for full stack roles',
        questions: mockQuestions,
        isDefault: false,
        createdAt: new Date().toISOString(),
      },
    ];

    setQuestions(mockQuestions);
    setQuestionBanks(mockBanks);
    setSelectedBank(mockBanks[0].id);
  }, []);

  const handleCreateQuestion = () => {
    setIsCreatingQuestion(true);
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsCreatingQuestion(false);
  };

  const handleSaveQuestion = (questionData: Partial<Question>) => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...questionData, updatedAt: new Date().toISOString() }
          : q
      ));
    } else {
      const newQuestion: Question = {
        id: Date.now().toString(),
        text: questionData.text || '',
        type: questionData.type || 'technical',
        category: questionData.category || 'General',
        difficulty: questionData.difficulty || 'medium',
        timeLimit: questionData.timeLimit || 120,
        points: questionData.points || 10,
        isRequired: questionData.isRequired || false,
        followUpQuestions: questionData.followUpQuestions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setQuestions(prev => [...prev, newQuestion]);
    }
    setIsCreatingQuestion(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    }
  };

  const handleDragStart = (e: React.DragEvent, questionId: string) => {
    setDraggedQuestion(questionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedQuestion) return;

    const draggedIndex = questions.findIndex(q => q.id === draggedQuestion);
    if (draggedIndex === targetIndex) return;

    const newQuestions = [...questions];
    const [draggedItem] = newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(targetIndex, 0, draggedItem);
    
    setQuestions(newQuestions);
    setDraggedQuestion(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'behavioral': return 'bg-green-100 text-green-800';
      case 'situational': return 'bg-purple-100 text-purple-800';
      case 'knockout': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const QuestionForm: React.FC = () => {
    const [formData, setFormData] = useState({
      text: editingQuestion?.text || '',
      type: editingQuestion?.type || 'technical' as Question['type'],
      category: editingQuestion?.category || '',
      difficulty: editingQuestion?.difficulty || 'medium' as Question['difficulty'],
      timeLimit: editingQuestion?.timeLimit || 120,
      points: editingQuestion?.points || 10,
      isRequired: editingQuestion?.isRequired || false,
      followUpQuestions: editingQuestion?.followUpQuestions?.join('\n') || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveQuestion({
        ...formData,
        followUpQuestions: formData.followUpQuestions.split('\n').filter(q => q.trim()),
      });
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingQuestion ? 'Edit Question' : 'Create New Question'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your question..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Question['type'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="situational">Situational</option>
                <option value="knockout">Knockout</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Frontend, Backend, Soft Skills"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as Question['difficulty'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 120 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="30"
                max="600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRequired"
                checked={formData.isRequired}
                onChange={(e) => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isRequired" className="ml-2 text-sm text-gray-700">
                Required question
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Questions (one per line)
            </label>
            <textarea
              value={formData.followUpQuestions}
              onChange={(e) => setFormData(prev => ({ ...prev, followUpQuestions: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter follow-up questions, one per line..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsCreatingQuestion(false);
                setEditingQuestion(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingQuestion ? 'Update Question' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Questions Manager</h1>
        <p className="text-gray-600">Create and manage custom interview questions for different roles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Form */}
        <div className="lg:col-span-1">
          {(isCreatingQuestion || editingQuestion) ? (
            <QuestionForm />
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Questions</span>
                  <span className="text-sm font-medium text-gray-900">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Technical</span>
                  <span className="text-sm font-medium text-gray-900">
                    {questions.filter(q => q.type === 'technical').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Behavioral</span>
                  <span className="text-sm font-medium text-gray-900">
                    {questions.filter(q => q.type === 'behavioral').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Knockout</span>
                  <span className="text-sm font-medium text-gray-900">
                    {questions.filter(q => q.type === 'knockout').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Required</span>
                  <span className="text-sm font-medium text-gray-900">
                    {questions.filter(q => q.isRequired).length}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleCreateQuestion}
                className="w-full mt-6 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create New Question
              </button>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Questions List</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, question.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="p-6 hover:bg-gray-50 cursor-move transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {question.isRequired && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                              {question.type}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">
                              {question.timeLimit}s • {question.points} pts
                            </span>
                          </div>
                          
                          <p className="text-gray-900 mb-2">{question.text}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Category: {question.category}</span>
                            {question.followUpQuestions.length > 0 && (
                              <span>{question.followUpQuestions.length} follow-ups</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {questions.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-600 mb-4">Start by creating your first custom question.</p>
                <button
                  onClick={handleCreateQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsManager;
