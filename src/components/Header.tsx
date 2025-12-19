import { Users, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store';
import { formatNumber } from '../utils/format';

export function Header() {
  const userStats = useAppStore((state) => state.userStats);

  return (
    <header className="bg-dark-900 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Alabama Environmental Monitoring by Jongwoo Lee
              </h1>
              <p className="text-xs text-gray-400">
                Real-time monitoring for our communities
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-dark-800 px-4 py-2 rounded-lg">
              <Users className="w-5 h-5 text-primary-500" />
              <div className="text-right">
                <div className="text-xs text-gray-400">Active Users</div>
                <div className="text-lg font-bold text-white">
                  {formatNumber(userStats.activeUsers)}
                </div>
              </div>
            </div>

            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
