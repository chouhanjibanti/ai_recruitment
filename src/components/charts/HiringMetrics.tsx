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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface HiringMetricsProps {
  data?: {
    funnelData: Array<{
      stage: string;
      count: number;
      conversionRate: number;
    }>;
    timeToHire: Array<{
      month: string;
      days: number;
    }>;
    sourceEffectiveness: Array<{
      source: string;
      candidates: number;
      hires: number;
      costPerHire: number;
    }>;
    qualityMetrics: Array<{
      metric: string;
      current: number;
      target: number;
      fullMark: 100;
    }>;
    diversityMetrics: Array<{
      category: string;
      percentage: number;
    }>;
  };
}

const HiringMetrics: React.FC<HiringMetricsProps> = ({ 
  data = mockData 
}) => {
  return (
    <div className="space-y-6">
      {/* Hiring Funnel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Funnel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.funnelData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="stage" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Candidates" />
            <Bar dataKey="conversionRate" fill="#10b981" name="Conversion %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time to Hire Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time to Hire Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.timeToHire}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="days"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Days to Hire"
                dot={{ fill: '#f59e0b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Source Effectiveness */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Effectiveness</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.sourceEffectiveness}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="candidates" fill="#8b5cf6" name="Candidates" />
              <Bar dataKey="hires" fill="#10b981" name="Hires" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Metrics Radar */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data.qualityMetrics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Current"
                dataKey="current"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Diversity Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Diversity Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.diversityMetrics}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
              >
                {data.diversityMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Per Hire Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Per Hire by Source</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.sourceEffectiveness}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, 'Cost Per Hire']} />
            <Legend />
            <Bar dataKey="costPerHire" fill="#ef4444" name="Cost Per Hire ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Mock data for demonstration
const mockData = {
  funnelData: [
    { stage: 'Applied', count: 1250, conversionRate: 100 },
    { stage: 'Screened', count: 450, conversionRate: 36 },
    { stage: 'Interviewed', count: 180, conversionRate: 40 },
    { stage: 'Technical', count: 95, conversionRate: 53 },
    { stage: 'Final Round', count: 45, conversionRate: 47 },
    { stage: 'Offered', count: 25, conversionRate: 56 },
    { stage: 'Hired', count: 18, conversionRate: 72 },
  ],
  timeToHire: [
    { month: 'Jan', days: 28 },
    { month: 'Feb', days: 32 },
    { month: 'Mar', days: 25 },
    { month: 'Apr', days: 30 },
    { month: 'May', days: 22 },
    { month: 'Jun', days: 20 },
  ],
  sourceEffectiveness: [
    { source: 'LinkedIn', candidates: 320, hires: 28, costPerHire: 450 },
    { source: 'Indeed', candidates: 280, hires: 22, costPerHire: 380 },
    { source: 'Referral', candidates: 95, hires: 18, costPerHire: 150 },
    { source: 'Career Site', candidates: 180, hires: 15, costPerHire: 220 },
    { source: 'Campus', candidates: 120, hires: 12, costPerHire: 180 },
  ],
  qualityMetrics: [
    { metric: 'Interview Score', current: 82, target: 85, fullMark: 100 },
    { metric: 'Retention Rate', current: 88, target: 90, fullMark: 100 },
    { metric: 'Performance', current: 78, target: 80, fullMark: 100 },
    { metric: 'Satisfaction', current: 85, target: 85, fullMark: 100 },
    { metric: 'Productivity', current: 75, target: 80, fullMark: 100 },
  ],
  diversityMetrics: [
    { category: 'Gender Balance', percentage: 42 },
    { category: 'Ethnic Diversity', percentage: 35 },
    { category: 'Age Diversity', percentage: 28 },
    { category: 'International', percentage: 25 },
    { category: 'Veterans', percentage: 8 },
  ],
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default HiringMetrics;
