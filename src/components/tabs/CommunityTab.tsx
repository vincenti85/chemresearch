import { Users, FileText, MessageSquare, TrendingUp, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ReportSubmissionForm } from '../forms/ReportSubmissionForm';
import { useAppStore } from '../../store';

const mockReports = [
  {
    id: '1',
    type: 'odor',
    description: 'Strong chemical smell near ABC Coke facility',
    location: 'North Birmingham',
    timestamp: '2024-12-08T14:30:00',
    status: 'verified',
  },
  {
    id: '2',
    type: 'visual',
    description: 'Dark smoke emission from industrial stack',
    location: 'Fairfield',
    timestamp: '2024-12-08T11:15:00',
    status: 'pending',
  },
  {
    id: '3',
    type: 'health',
    description: 'Multiple residents reporting respiratory issues',
    location: 'Collegeville',
    timestamp: '2024-12-07T19:45:00',
    status: 'verified',
  },
];

const reportsOverTime = [
  { month: 'Jun', reports: 85 },
  { month: 'Jul', reports: 102 },
  { month: 'Aug', reports: 118 },
  { month: 'Sep', reports: 95 },
  { month: 'Oct', reports: 134 },
  { month: 'Nov', reports: 156 },
];

const reportTypes = [
  { type: 'Odor', count: 542, color: 'text-purple-500 bg-purple-900/20' },
  { type: 'Visual', count: 389, color: 'text-blue-500 bg-blue-900/20' },
  { type: 'Health', count: 287, color: 'text-danger-500 bg-danger-900/20' },
  { type: 'Noise', count: 156, color: 'text-warning-500 bg-warning-900/20' },
  { type: 'Other', count: 169, color: 'text-gray-500 bg-gray-900/20' },
];

export function CommunityTab() {
  const isReportFormOpen = useAppStore((state) => state.isReportFormOpen);
  const setIsReportFormOpen = useAppStore((state) => state.setIsReportFormOpen);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      odor: '👃',
      visual: '👁️',
      health: '🏥',
      noise: '🔊',
      other: '📝',
    };
    return icons[type] || '📝';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-primary-500 bg-primary-900/20';
      case 'pending':
        return 'text-warning-500 bg-warning-900/20';
      case 'dismissed':
        return 'text-gray-500 bg-gray-900/20';
      default:
        return 'text-gray-500 bg-gray-900/20';
    }
  };

  const handleReportSuccess = () => {
    alert('Report submitted successfully! Thank you for helping protect our environment.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Community Reports</h2>
        <p className="text-gray-400">Citizen science and community-driven environmental monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="w-5 h-5 text-primary-500" />
            <span className="text-gray-400 text-sm font-medium">Total Reports</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">1,543</div>
          <div className="flex items-center space-x-1 text-sm text-primary-500">
            <TrendingUp className="w-4 h-4" />
            <span>+23% this month</span>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-5 h-5 text-accent-500" />
            <span className="text-gray-400 text-sm font-medium">Active Contributors</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">847</div>
          <div className="text-sm text-gray-500">This week</div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="text-gray-400 text-sm font-medium">Verified Reports</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">892</div>
          <div className="text-sm text-gray-500">58% verification rate</div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span className="text-gray-400 text-sm font-medium">Active Zones</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">12</div>
          <div className="text-sm text-gray-500">High-activity areas</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Reports Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reportsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="reports" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Report Categories</h3>
          <div className="space-y-3">
            {reportTypes.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-lg ${item.color} font-medium text-sm`}>
                    {item.type}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(item.count / 600) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold w-12 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-dark-700">
          <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
        </div>
        <div className="divide-y divide-dark-700">
          {mockReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-dark-900/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getTypeIcon(report.type)}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-semibold capitalize">{report.type} Report</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{report.location}</span>
                      </div>
                      <span>
                        {new Date(report.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-primary-500 hover:text-primary-400 text-sm font-medium">
                  Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-900/20 to-accent-900/20 border border-primary-800/30 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-white mb-3">Submit a Report</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          Your observations matter. Help document environmental issues in your community and contribute
          to a healthier Alabama for everyone.
        </p>
        <button
          onClick={() => setIsReportFormOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Create New Report
        </button>
      </div>

      <ReportSubmissionForm
        isOpen={isReportFormOpen}
        onClose={() => setIsReportFormOpen(false)}
        onSuccess={handleReportSuccess}
      />
    </div>
  );
}
