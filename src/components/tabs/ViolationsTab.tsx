import { AlertTriangle, Building2, DollarSign, Calendar } from 'lucide-react';

const mockViolations = [
  {
    id: '1',
    company: 'ABC Coke (Drummond)',
    facility: 'North Birmingham Coke Plant',
    type: 'Clean Air Act',
    description: 'Excessive benzene emissions exceeding permitted levels',
    date: '2024-11-15',
    fine: 2850000,
    status: 'active',
    severity: 'critical',
  },
  {
    id: '2',
    company: '3M Corporation',
    facility: 'Decatur Manufacturing',
    type: 'Clean Water Act',
    description: 'PFAS discharge into Tennessee River',
    date: '2024-10-22',
    fine: 8500000,
    status: 'under_review',
    severity: 'high',
  },
  {
    id: '3',
    company: 'AM/NS Calvert',
    facility: 'Calvert Steel Mill',
    type: 'RCRA',
    description: 'Improper hazardous waste storage',
    date: '2024-09-08',
    fine: 1250000,
    status: 'resolved',
    severity: 'medium',
  },
  {
    id: '4',
    company: 'Alabama Power',
    facility: 'Miller Steam Plant',
    type: 'Clean Air Act',
    description: 'Sulfur dioxide emissions violation',
    date: '2024-08-30',
    fine: 3200000,
    status: 'active',
    severity: 'high',
  },
];

export function ViolationsTab() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-danger-500 bg-danger-900/20 border-danger-800';
      case 'high':
        return 'text-orange-500 bg-orange-900/20 border-orange-800';
      case 'medium':
        return 'text-warning-500 bg-warning-900/20 border-warning-800';
      default:
        return 'text-gray-500 bg-gray-900/20 border-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-danger-500 bg-danger-900/20';
      case 'under_review':
        return 'text-warning-500 bg-warning-900/20';
      case 'resolved':
        return 'text-primary-500 bg-primary-900/20';
      default:
        return 'text-gray-500 bg-gray-900/20';
    }
  };

  const totalFines = mockViolations.reduce((sum, v) => sum + v.fine, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Corporate Violations Tracker</h2>
        <p className="text-gray-400">Monitoring environmental compliance and enforcement actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-danger-500" />
            <span className="text-gray-400 text-sm font-medium">Active Violations</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {mockViolations.filter((v) => v.status === 'active').length}
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="w-5 h-5 text-warning-500" />
            <span className="text-gray-400 text-sm font-medium">Total Fines</span>
          </div>
          <div className="text-3xl font-bold text-white">
            ${(totalFines / 1000000).toFixed(1)}M
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            <span className="text-gray-400 text-sm font-medium">Facilities Tracked</span>
          </div>
          <div className="text-3xl font-bold text-white">47</div>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-dark-700">
          <h3 className="text-lg font-semibold text-white">Recent Violations</h3>
        </div>
        <div className="divide-y divide-dark-700">
          {mockViolations.map((violation) => (
            <div key={violation.id} className="p-6 hover:bg-dark-900/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-white font-semibold text-lg">{violation.company}</h4>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                        violation.severity
                      )}`}
                    >
                      {violation.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{violation.facility}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(violation.status)}`}>
                  {violation.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="bg-dark-900 rounded-lg p-4 mb-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-danger-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-white mb-1">{violation.type}</div>
                    <p className="text-sm text-gray-400">{violation.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(violation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-warning-500">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">
                      ${(violation.fine / 1000000).toFixed(2)}M fine
                    </span>
                  </div>
                </div>
                <button className="text-primary-500 hover:text-primary-400 font-medium">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
