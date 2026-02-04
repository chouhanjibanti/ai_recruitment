import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface InterviewAnalyticsProps {
  data?: {
    weeklyStats: Array<{
      week: string;
      interviews: number;
      completed: number;
      successRate: number;
    }>;
    statusDistribution: Array<{
      status: string;
      count: number;
      color: string;
    }>;
    departmentPerformance: Array<{
      department: string;
      avgScore: number;
      completionRate: number;
      interviews: number;
    }>;
    skillAnalysis: Array<{
      skill: string;
      frequency: number;
      avgScore: number;
    }>;
  };
}

const InterviewAnalytics: React.FC<InterviewAnalyticsProps> = ({ 
  data = mockData 
}) => {
  return (
    <div className="space-y-6">
      {/* Weekly Interview Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Interview Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.weeklyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="interviews"
              stackId="1"
              stroke="#3b82f6"
              fill="#93c5fd"
              name="Total Interviews"
            />
            <Area
              type="monotone"
              dataKey="completed"
              stackId="1"
              stroke="#10b981"
              fill="#86efac"
              name="Completed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interview Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgScore" fill="#3b82f6" name="Avg Score" />
              <Bar dataKey="completionRate" fill="#10b981" name="Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Success Rate Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.weeklyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="successRate"
              stroke="#10b981"
              strokeWidth={2}
              name="Success Rate %"
              dot={{ fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.skillAnalysis} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="skill" type="category" width={80} />
            <Tooltip />
            <Legend />
            <Bar dataKey="frequency" fill="#8b5cf6" name="Frequency" />
            <Bar dataKey="avgScore" fill="#f59e0b" name="Avg Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Mock data for demonstration
const mockData = {
  weeklyStats: [
    { week: 'Week 1', interviews: 12, completed: 10, successRate: 75 },
    { week: 'Week 2', interviews: 18, completed: 15, successRate: 83 },
    { week: 'Week 3', interviews: 15, completed: 12, successRate: 80 },
    { week: 'Week 4', interviews: 22, completed: 18, successRate: 82 },
    { week: 'Week 5', interviews: 20, completed: 17, successRate: 85 },
    { week: 'Week 6', interviews: 25, completed: 22, successRate: 88 },
  ],
  statusDistribution: [
    { status: 'Completed', count: 94, color: '#10b981' },
    { status: 'In Progress', count: 28, color: '#3b82f6' },
    { status: 'Scheduled', count: 15, color: '#f59e0b' },
    { status: 'Cancelled', count: 8, color: '#ef4444' },
  ],
  departmentPerformance: [
    { department: 'Engineering', avgScore: 85, completionRate: 92, interviews: 45 },
    { department: 'Product', avgScore: 78, completionRate: 88, interviews: 22 },
    { department: 'Design', avgScore: 82, completionRate: 85, interviews: 18 },
    { department: 'Sales', avgScore: 75, completionRate: 90, interviews: 30 },
    { department: 'HR', avgScore: 80, completionRate: 87, interviews: 20 },
  ],
  skillAnalysis: [
    { skill: 'React', frequency: 35, avgScore: 88 },
    { skill: 'TypeScript', frequency: 28, avgScore: 85 },
    { skill: 'Node.js', frequency: 25, avgScore: 82 },
    { skill: 'Python', frequency: 22, avgScore: 79 },
    { skill: 'CSS', frequency: 20, avgScore: 76 },
    { skill: 'Leadership', frequency: 18, avgScore: 84 },
    { skill: 'Communication', frequency: 32, avgScore: 81 },
    { skill: 'Problem Solving', frequency: 30, avgScore: 87 },
  ],
};

export default InterviewAnalytics;
