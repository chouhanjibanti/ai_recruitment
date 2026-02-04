import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter,
  Search,
  Calendar,
  BarChart3,
  Target,
  MessageSquare,
  UserCheck,
  Briefcase,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  candidates: number;
  averageTime: string;
  conversionRate: number;
  order: number;
}

interface Pipeline {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  location: string;
  status: 'active' | 'paused' | 'completed';
  totalCandidates: number;
  hiredCandidates: number;
  rejectionRate: number;
  averageTimeToHire: string;
  stages: PipelineStage[];
  createdAt: string;
  lastUpdated: string;
  hiringManager: string;
  recruiter: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  currentStage: string;
  appliedDate: string;
  lastActivity: string;
  score: number;
  status: 'active' | 'rejected' | 'hired' | 'on-hold';
  avatar: string;
  experience: string;
  location: string;
  expectedSalary: string;
  skills: string[];
}

const PipelinesPage: React.FC = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPipelines: Pipeline[] = [
        {
          id: '1',
          name: 'Senior Frontend Developer',
          jobTitle: 'Senior Frontend Developer',
          department: 'Engineering',
          location: 'San Francisco, CA',
          status: 'active',
          totalCandidates: 156,
          hiredCandidates: 3,
          rejectionRate: 65,
          averageTimeToHire: '32 days',
          stages: [
            {
              id: '1',
              name: 'Application Review',
              description: 'Initial screening of applications',
              color: 'bg-blue-500',
              icon: <Users className="w-4 h-4" />,
              candidates: 156,
              averageTime: '2 days',
              conversionRate: 60,
              order: 1,
            },
            {
              id: '2',
              name: 'Technical Assessment',
              description: 'Coding challenge and technical evaluation',
              color: 'bg-purple-500',
              icon: <BarChart3 className="w-4 h-4" />,
              candidates: 94,
              averageTime: '4 days',
              conversionRate: 45,
              order: 2,
            },
            {
              id: '3',
              name: 'Technical Interview',
              description: 'In-depth technical discussion',
              color: 'bg-orange-500',
              icon: <Target className="w-4 h-4" />,
              candidates: 42,
              averageTime: '5 days',
              conversionRate: 70,
              order: 3,
            },
            {
              id: '4',
              name: 'Behavioral Interview',
              description: 'Cultural fit and soft skills assessment',
              color: 'bg-green-500',
              icon: <MessageSquare className="w-4 h-4" />,
              candidates: 30,
              averageTime: '1 day',
              conversionRate: 90,
              order: 4,
            },
            {
              id: '5',
              name: 'Final Interview',
              description: 'Final round with leadership',
              color: 'bg-indigo-500',
              icon: <UserCheck className="w-4 h-4" />,
              candidates: 27,
              averageTime: '2 days',
              conversionRate: 80,
              order: 5,
            },
          ],
          createdAt: '2024-01-15',
          lastUpdated: '2024-01-20',
          hiringManager: 'John Smith',
          recruiter: 'Sarah Johnson',
        },
        {
          id: '2',
          name: 'Product Manager',
          jobTitle: 'Product Manager',
          department: 'Product',
          location: 'New York, NY',
          status: 'active',
          totalCandidates: 89,
          hiredCandidates: 1,
          rejectionRate: 72,
          averageTimeToHire: '28 days',
          stages: [
            {
              id: '1',
              name: 'Application Review',
              description: 'Initial screening of applications',
              color: 'bg-blue-500',
              icon: <Users className="w-4 h-4" />,
              candidates: 89,
              averageTime: '2 days',
              conversionRate: 55,
              order: 1,
            },
            {
              id: '2',
              name: 'Case Study',
              description: 'Product case study evaluation',
              color: 'bg-purple-500',
              icon: <BarChart3 className="w-4 h-4" />,
              candidates: 49,
              averageTime: '5 days',
              conversionRate: 40,
              order: 2,
            },
            {
              id: '3',
              name: 'Product Interview',
              description: 'Product strategy and vision discussion',
              color: 'bg-orange-500',
              icon: <Target className="w-4 h-4" />,
              candidates: 20,
              averageTime: '3 days',
              conversionRate: 75,
              order: 3,
            },
            {
              id: '4',
              name: 'Leadership Interview',
              description: 'Final leadership assessment',
              color: 'bg-green-500',
              icon: <MessageSquare className="w-4 h-4" />,
              candidates: 15,
              averageTime: '1 day',
              conversionRate: 85,
              order: 4,
            },
          ],
          createdAt: '2024-01-10',
          lastUpdated: '2024-01-18',
          hiringManager: 'Emily Davis',
          recruiter: 'Michael Brown',
        },
      ];

      const mockCandidates: Candidate[] = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '+1 234-567-8901',
          currentStage: 'Technical Interview',
          appliedDate: '2024-01-15',
          lastActivity: '2024-01-18',
          score: 85,
          status: 'active',
          avatar: 'AJ',
          experience: '5 years',
          location: 'San Francisco, CA',
          expectedSalary: '$120k-$150k',
          skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          phone: '+1 234-567-8902',
          currentStage: 'Behavioral Interview',
          appliedDate: '2024-01-12',
          lastActivity: '2024-01-17',
          score: 92,
          status: 'active',
          avatar: 'BS',
          experience: '7 years',
          location: 'New York, NY',
          expectedSalary: '$130k-$160k',
          skills: ['Product Management', 'Agile', 'Data Analysis', 'SQL'],
        },
        {
          id: '3',
          name: 'Carol Williams',
          email: 'carol@example.com',
          phone: '+1 234-567-8903',
          currentStage: 'Application Review',
          appliedDate: '2024-01-18',
          lastActivity: '2024-01-19',
          score: 78,
          status: 'active',
          avatar: 'CW',
          experience: '3 years',
          location: 'Austin, TX',
          expectedSalary: '$100k-$130k',
          skills: ['JavaScript', 'Vue.js', 'CSS', 'HTML'],
        },
      ];

      setPipelines(mockPipelines);
      setCandidates(mockCandidates);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredPipelines = pipelines.filter(pipeline => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pipeline.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleStageExpansion = (stageId: string) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId);
    } else {
      newExpanded.add(stageId);
    }
    setExpandedStages(newExpanded);
  };

  const viewPipelineDetails = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setShowPipelineModal(true);
  };

  const viewCandidateDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Hiring Pipelines</h1>
        <p className="text-gray-600">Manage and track your recruitment pipelines</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Pipelines</p>
              <p className="text-2xl font-bold text-gray-900">{pipelines.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">
                {pipelines.reduce((sum, p) => sum + p.totalCandidates, 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hired This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {pipelines.reduce((sum, p) => sum + p.hiredCandidates, 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Time to Hire</p>
              <p className="text-2xl font-bold text-gray-900">30 days</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search pipelines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Create Pipeline
          </button>
        </div>
      </div>

      {/* Pipelines List */}
      <div className="space-y-4">
        {filteredPipelines.map((pipeline) => (
          <div key={pipeline.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{pipeline.name}</h3>
                    <p className="text-sm text-gray-600">{pipeline.department} • {pipeline.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pipeline.status)}`}>
                    {pipeline.status}
                  </span>
                  <button
                    onClick={() => viewPipelineDetails(pipeline)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pipeline Stages */}
              <div className="space-y-3">
                {pipeline.stages.map((stage) => (
                  <div key={stage.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleStageExpansion(stage.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {expandedStages.has(stage.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <div className={`p-2 rounded-lg ${stage.color} bg-opacity-20`}>
                          {stage.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{stage.name}</h4>
                          <p className="text-sm text-gray-600">{stage.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{stage.candidates}</p>
                          <p className="text-gray-600">Candidates</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{stage.averageTime}</p>
                          <p className="text-gray-600">Avg. Time</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{stage.conversionRate}%</p>
                          <p className="text-gray-600">Conversion</p>
                        </div>
                      </div>
                    </div>

                    {expandedStages.has(stage.id) && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {candidates
                            .filter(c => c.currentStage === stage.name)
                            .map(candidate => (
                              <div
                                key={candidate.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => viewCandidateDetails(candidate)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                    {candidate.avatar}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{candidate.name}</p>
                                    <p className="text-sm text-gray-600">{candidate.score}% match</p>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pipeline Stats */}
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-gray-600">Total Candidates:</span>
                    <span className="font-medium text-gray-900 ml-1">{pipeline.totalCandidates}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hired:</span>
                    <span className="font-medium text-green-600 ml-1">{pipeline.hiredCandidates}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Rejection Rate:</span>
                    <span className="font-medium text-red-600 ml-1">{pipeline.rejectionRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg. Time to Hire:</span>
                    <span className="font-medium text-gray-900 ml-1">{pipeline.averageTimeToHire}</span>
                  </div>
                </div>
                <div className="text-gray-500">
                  Updated {pipeline.lastUpdated}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Details Modal */}
      {showPipelineModal && selectedPipeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedPipeline.name}</h2>
                <button
                  onClick={() => setShowPipelineModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Job Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <span className="ml-2 text-gray-900">{selectedPipeline.department}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 text-gray-900">{selectedPipeline.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPipeline.status)}`}>
                        {selectedPipeline.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Team</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Hiring Manager:</span>
                      <span className="ml-2 text-gray-900">{selectedPipeline.hiringManager}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Recruiter:</span>
                      <span className="ml-2 text-gray-900">{selectedPipeline.recruiter}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-4">Pipeline Performance</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Candidates</p>
                    <p className="text-xl font-bold text-gray-900">{selectedPipeline.totalCandidates}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Hired</p>
                    <p className="text-xl font-bold text-green-600">{selectedPipeline.hiredCandidates}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Rejection Rate</p>
                    <p className="text-xl font-bold text-red-600">{selectedPipeline.rejectionRate}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Avg. Time to Hire</p>
                    <p className="text-xl font-bold text-gray-900">{selectedPipeline.averageTimeToHire}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4">Stage Details</h3>
                <div className="space-y-3">
                  {selectedPipeline.stages.map((stage) => (
                    <div key={stage.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${stage.color} bg-opacity-20`}>
                            {stage.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{stage.name}</h4>
                            <p className="text-sm text-gray-600">{stage.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">{stage.candidates}</p>
                            <p className="text-gray-600">Candidates</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">{stage.averageTime}</p>
                            <p className="text-gray-600">Avg. Time</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">{stage.conversionRate}%</p>
                            <p className="text-gray-600">Conversion</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Details Modal */}
      {showCandidateModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Candidate Details</h2>
                <button
                  onClick={() => setShowCandidateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-medium">
                  {selectedCandidate.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedCandidate.name}</h3>
                  <p className="text-gray-600">{selectedCandidate.experience} • {selectedCandidate.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{selectedCandidate.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-gray-900">{selectedCandidate.phone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Application Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Applied:</span>
                      <span className="ml-2 text-gray-900">{selectedCandidate.appliedDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Current Stage:</span>
                      <span className="ml-2 text-gray-900">{selectedCandidate.currentStage}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Match Score:</span>
                      <span className="ml-2 font-medium text-green-600">{selectedCandidate.score}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Salary:</span>
                      <span className="ml-2 text-gray-900">{selectedCandidate.expectedSalary}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Schedule Interview
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Send Message
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelinesPage;
