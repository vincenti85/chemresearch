import { Droplets, Calculator, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useState } from 'react';
import { EducationalWidget } from '../common/EducationalWidget';

const mockPFASData = [
  { site: 'Decatur', pfas: 28, limit: 70 },
  { site: 'Birmingham', pfas: 45, limit: 70 },
  { site: 'Montgomery', pfas: 15, limit: 70 },
  { site: 'Mobile', pfas: 32, limit: 70 },
  { site: 'Huntsville', pfas: 22, limit: 70 },
];

const mockTrendData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  pfas: Math.random() * 40 + 10,
}));

export function PFASCheck() {
  const [filterUsage, setFilterUsage] = useState(60);
  const currentPFAS = 28;
  const epaLimit = 70;
  const filterCapacity = 100;

  const filterLife = Math.max(0, 100 - (filterUsage / filterCapacity) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">PFAS-Check</h2>
        <p className="text-gray-400">Water quality monitoring and filtration analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EducationalWidget targetMetric="pfas" className="rounded-xl">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Current PFAS Level</h3>
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-center py-6">
              <div className="text-6xl font-bold text-primary-500 mb-2">{currentPFAS}</div>
              <div className="text-lg text-gray-400 mb-4">ppt (parts per trillion)</div>
              <div className="flex items-center justify-center space-x-2 text-primary-500">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Below EPA Limit</span>
              </div>
            </div>
          </div>
        </EducationalWidget>

        <EducationalWidget targetMetric="epa_limit" className="rounded-xl">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">EPA Safety Limit</h3>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-center py-6">
              <div className="text-6xl font-bold text-gray-400 mb-2">{epaLimit}</div>
              <div className="text-lg text-gray-400 mb-4">ppt (parts per trillion)</div>
              <div className="bg-dark-900 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Current Level</span>
                  <span className="text-white font-medium">{((currentPFAS / epaLimit) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{ width: `${(currentPFAS / epaLimit) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </EducationalWidget>

        <EducationalWidget targetMetric="filter_life" className="rounded-xl">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Filter Life</h3>
              <Calculator className="w-5 h-5 text-accent-500" />
            </div>
            <div className="text-center py-6">
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-dark-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - filterLife / 100)}`}
                    className="text-accent-500 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{filterLife.toFixed(0)}%</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">Remaining Capacity</div>
            </div>
          </div>
        </EducationalWidget>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">PFAS Levels by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockPFASData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="site"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'ppt', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="pfas" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="limit" fill="#374151" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">12-Month Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'ppt', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="pfas"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Filter Life Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gallons Filtered
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filterUsage}
              onChange={(e) => setFilterUsage(Number(e.target.value))}
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>0 gal</span>
              <span className="font-medium text-white">{filterUsage} gal</span>
              <span>100 gal</span>
            </div>
          </div>

          <div className="bg-dark-900 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Filter Capacity:</span>
                <span className="text-white font-medium">{filterCapacity} gallons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Water Filtered:</span>
                <span className="text-white font-medium">{filterUsage} gallons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Remaining Life:</span>
                <span className="text-accent-500 font-medium">{filterLife.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dark-700">
                <span className="text-gray-400">Replacement Needed:</span>
                <span className="text-white font-medium">
                  {filterLife < 20 ? 'Soon' : filterLife < 50 ? 'In 2-3 weeks' : 'In 1-2 months'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-3">About PFAS</h4>
        <p className="text-gray-300 leading-relaxed mb-3">
          PFAS (Per- and Polyfluoroalkyl Substances) are synthetic chemicals used in various industrial
          applications and consumer products. They're often called "forever chemicals" because they don't
          break down in the environment.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-dark-800/50 rounded-lg p-4">
            <h5 className="font-semibold text-white mb-1">Health Risks</h5>
            <p className="text-sm text-gray-400">Cancer, liver damage, immune system effects</p>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-4">
            <h5 className="font-semibold text-white mb-1">Common Sources</h5>
            <p className="text-sm text-gray-400">Industrial discharge, firefighting foam, treated products</p>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-4">
            <h5 className="font-semibold text-white mb-1">Protection</h5>
            <p className="text-sm text-gray-400">Activated carbon filters, reverse osmosis systems</p>
          </div>
        </div>
      </div>
    </div>
  );
}
