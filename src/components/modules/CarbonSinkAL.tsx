import { Mountain, Factory, TrendingDown, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { EducationalWidget } from '../common/EducationalWidget';

const formationData = [
  { name: 'Tuscaloosa Marine Shale', value: 850, color: '#10b981' },
  { name: 'Black Warrior Basin', value: 620, color: '#3b82f6' },
  { name: 'Chattanooga Shale', value: 480, color: '#f59e0b' },
  { name: 'Knox Group', value: 390, color: '#8b5cf6' },
];

const industryEmissions = [
  { name: 'Steel Production', emissions: 2.4, capacity: 3.5 },
  { name: 'Chemical Plants', emissions: 1.8, capacity: 2.2 },
  { name: 'Cement', emissions: 1.2, capacity: 1.8 },
  { name: 'Power Generation', emissions: 3.1, capacity: 4.0 },
  { name: 'Refineries', emissions: 1.6, capacity: 2.1 },
];

const locations = [
  { name: 'Birmingham Region', formations: 3, capacity: 980, distance: '25 miles' },
  { name: 'Mobile Area', formations: 2, capacity: 620, distance: '40 miles' },
  { name: 'Tuscaloosa Region', formations: 4, capacity: 1240, distance: '15 miles' },
];

export function CarbonSinkAL() {
  const totalCapacity = formationData.reduce((sum, f) => sum + f.value, 0);
  const totalEmissions = industryEmissions.reduce((sum, i) => sum + i.emissions, 0);
  const yearsOfCapacity = (totalCapacity / totalEmissions).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">CarbonSink AL</h2>
        <p className="text-gray-400">CO2 sequestration potential and geological analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EducationalWidget targetMetric="carbon" className="rounded-xl">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Total Capacity</h3>
              <Mountain className="w-5 h-5 text-accent-500" />
            </div>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-accent-500 mb-2">{totalCapacity.toFixed(1)}M</div>
              <div className="text-lg text-gray-400 mb-4">metric tons CO2</div>
              <div className="bg-dark-900 rounded-lg p-3">
                <div className="text-sm text-gray-400">Across 4 geological formations</div>
              </div>
            </div>
          </div>
        </EducationalWidget>

        <EducationalWidget targetMetric="emissions" className="rounded-xl">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Current Emissions</h3>
              <Factory className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-orange-500 mb-2">{totalEmissions.toFixed(1)}M</div>
              <div className="text-lg text-gray-400 mb-4">tons/year</div>
              <div className="bg-dark-900 rounded-lg p-3">
                <div className="text-sm text-gray-400">From major industrial facilities</div>
              </div>
            </div>
          </div>
        </EducationalWidget>

        <EducationalWidget targetMetric="carbon_capture" className="rounded-xl">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Sequestration Potential</h3>
              <TrendingDown className="w-5 h-5 text-primary-500" />
            </div>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-primary-500 mb-2">{yearsOfCapacity}</div>
              <div className="text-lg text-gray-400 mb-4">years of storage</div>
              <div className="bg-dark-900 rounded-lg p-3">
                <div className="text-sm text-gray-400">At current emission rates</div>
              </div>
            </div>
          </div>
        </EducationalWidget>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Storage Capacity by Formation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {formationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => [`${value}M tons`, 'Capacity']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Industrial Emissions vs. Capacity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryEmissions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'M tons/year', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="emissions" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Current Emissions" />
              <Bar dataKey="capacity" fill="#10b981" radius={[8, 8, 0, 0]} name="Capture Capacity" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sequestration Sites</h3>
        <div className="space-y-4">
          {locations.map((location) => (
            <div
              key={location.name}
              className="bg-dark-900 border border-dark-700 rounded-lg p-4 hover:border-accent-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-accent-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">{location.name}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Formations</div>
                        <div className="text-white font-medium">{location.formations}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Capacity</div>
                        <div className="text-white font-medium">{location.capacity}M tons</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Avg. Distance</div>
                        <div className="text-white font-medium">{location.distance}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="text-accent-500 hover:text-accent-400 text-sm font-medium">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-accent-900/20 border border-accent-800/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
            <Mountain className="w-5 h-5 text-accent-500" />
            <span>How It Works</span>
          </h4>
          <p className="text-gray-300 leading-relaxed mb-3">
            Carbon sequestration involves capturing CO2 emissions from industrial sources and storing them
            in deep underground geological formations. Alabama's geology includes several suitable
            formations for long-term CO2 storage.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-accent-500 mt-0.5">•</span>
              <span>CO2 is captured from industrial facilities</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent-500 mt-0.5">•</span>
              <span>Compressed and transported via pipeline</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent-500 mt-0.5">•</span>
              <span>Injected into porous rock formations 1-2 miles deep</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent-500 mt-0.5">•</span>
              <span>Trapped by impermeable cap rock layers</span>
            </li>
          </ul>
        </div>

        <div className="bg-orange-900/20 border border-orange-800/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
            <Factory className="w-5 h-5 text-orange-500" />
            <span>Community Considerations</span>
          </h4>
          <p className="text-gray-300 leading-relaxed mb-3">
            While carbon sequestration can reduce atmospheric CO2, communities must be informed about
            potential risks and ensure proper regulatory oversight.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Groundwater contamination risks must be assessed</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Seismic activity monitoring is essential</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Local communities should have input in site selection</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>Transparent reporting and emergency response plans needed</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
