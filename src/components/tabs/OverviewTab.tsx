import { Wind, Droplets, Mountain, AlertTriangle, FileText, Users } from 'lucide-react';
import { useAppStore } from '../../store';
import { StatCard } from '../common/StatCard';
import { formatNumber } from '../../utils/format';

export function OverviewTab() {
  const userStats = useAppStore((state) => state.userStats);

  const apps = [
    {
      name: 'CokeWatch',
      icon: Wind,
      description: 'Real-time benzene monitoring and air quality tracking',
      color: 'text-accent-500',
      bgColor: 'bg-accent-900/20',
      stats: { current: '12.5 ppb', status: 'Moderate', color: 'text-warning-500' },
    },
    {
      name: 'PFAS-Check',
      icon: Droplets,
      description: 'Water quality monitoring and filter life calculation',
      color: 'text-blue-500',
      bgColor: 'bg-blue-900/20',
      stats: { current: '28 ppt', status: 'Safe', color: 'text-primary-500' },
    },
    {
      name: 'CarbonSink AL',
      icon: Mountain,
      description: 'CO2 sequestration potential and geological analysis',
      color: 'text-orange-500',
      bgColor: 'bg-orange-900/20',
      stats: { current: '2.4B tons', status: 'Capacity', color: 'text-gray-400' },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Users"
          value={formatNumber(userStats.activeUsers)}
          icon={Users}
          iconColor="text-primary-500"
          bgColor="bg-primary-900/20"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Community Reports"
          value={formatNumber(userStats.totalReports)}
          icon={FileText}
          iconColor="text-blue-500"
          bgColor="bg-blue-900/20"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Violations"
          value={formatNumber(userStats.resolvedViolations)}
          icon={AlertTriangle}
          iconColor="text-danger-500"
          bgColor="bg-danger-900/20"
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          title="Monitoring Sites"
          value={formatNumber(userStats.monitoringSites)}
          icon={Wind}
          iconColor="text-accent-500"
          bgColor="bg-accent-900/20"
        />
      </div>

      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Environmental Monitoring Apps</h2>
          <p className="text-gray-400">
            Three integrated tools for comprehensive environmental justice tracking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.name}
                className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-primary-600 transition-all hover:shadow-lg hover:shadow-primary-900/20 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${app.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${app.color}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{app.stats.current}</div>
                    <div className={`text-sm font-medium ${app.stats.color}`}>
                      {app.stats.status}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{app.description}</p>

                <div className="mt-4 pt-4 border-t border-dark-700">
                  <button className="text-primary-500 hover:text-primary-400 text-sm font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>View Details</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-900/20 to-accent-900/20 border border-primary-800/30 rounded-xl p-8">
        <div className="flex items-start justify-between">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-3">
              Join the Movement for Environmental Justice
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Together, we're building a healthier Alabama. Your reports help document violations,
              protect communities, and hold corporations accountable.
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Submit a Report
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-lg p-4">
              <div className="text-4xl font-bold text-primary-500 mb-1">11.8B</div>
              <div className="text-sm text-gray-400">Total Fines & Settlements</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
