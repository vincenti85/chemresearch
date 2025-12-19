import { Wind, Gauge, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getAQIInfo } from '../../utils/aqi';
import { EducationalWidget } from '../common/EducationalWidget';

const mockBenzeneData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  benzene: Math.random() * 20 + 5,
  threshold: 15,
}));

const mockWindData = [
  { direction: 'N', speed: 8 },
  { direction: 'NE', speed: 12 },
  { direction: 'E', speed: 6 },
  { direction: 'SE', speed: 4 },
  { direction: 'S', speed: 10 },
  { direction: 'SW', speed: 15 },
  { direction: 'W', speed: 18 },
  { direction: 'NW', speed: 14 },
];

export function CokeWatch() {
  const currentBenzene = 12.5;
  const currentAQI = 87;
  const aqiInfo = getAQIInfo(currentAQI);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">CokeWatch</h2>
        <p className="text-gray-400">Real-time air quality monitoring for North Birmingham</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EducationalWidget targetMetric="aqi" className="rounded-xl">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Current AQI</h3>
              <Gauge className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-center py-6">
              <div
                className="text-6xl font-bold mb-2"
                style={{ color: aqiInfo.color }}
              >
                {currentAQI}
              </div>
              <div className="text-lg font-medium text-white mb-2">{aqiInfo.description}</div>
              <div className="text-sm text-gray-400 max-w-xs mx-auto">
                {aqiInfo.healthImplications}
              </div>
            </div>
          </div>
        </EducationalWidget>

        <EducationalWidget targetMetric="benzene" className="rounded-xl">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Benzene Level</h3>
              <AlertTriangle className="w-5 h-5 text-warning-500" />
            </div>
            <div className="text-center py-6">
              <div className="text-6xl font-bold text-warning-500 mb-2">{currentBenzene}</div>
              <div className="text-lg text-gray-400 mb-4">ppb (parts per billion)</div>
              <div className="bg-dark-900 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">EPA Threshold</span>
                  <span className="text-white font-medium">15 ppb</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className="bg-warning-500 h-2 rounded-full transition-all"
                    style={{ width: `${(currentBenzene / 15) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </EducationalWidget>

        <EducationalWidget targetMetric="wind" className="rounded-xl">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Wind Conditions</h3>
              <Wind className="w-5 h-5 text-accent-500" />
            </div>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-accent-500 mb-2">SW</div>
              <div className="text-lg text-gray-400 mb-1">Direction</div>
              <div className="text-3xl font-bold text-white mb-1">12 mph</div>
              <div className="text-sm text-gray-400">Wind Speed</div>
            </div>
          </div>
        </EducationalWidget>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">24-Hour Benzene Levels</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockBenzeneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'ppb', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
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
                dataKey="threshold"
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="benzene"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Wind Rose Pattern</h3>
            <Wind className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={mockWindData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="direction" stroke="#9ca3af" />
              <PolarRadiusAxis stroke="#9ca3af" />
              <Radar
                name="Wind Speed"
                dataKey="speed"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-danger-900/20 border border-danger-800/30 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-6 h-6 text-danger-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Health Advisory</h4>
            <p className="text-gray-300 leading-relaxed">
              {aqiInfo.cautionaryStatement !== 'None'
                ? aqiInfo.cautionaryStatement
                : 'Air quality is currently good. No special precautions needed.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
