import { CokeWatch } from '../modules/CokeWatch';
import { PFASCheck } from '../modules/PFASCheck';
import { CarbonSinkAL } from '../modules/CarbonSinkAL';
import { useAppStore } from '../../store';
import { Sparkles, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export function MonitoringTab() {
  const activeModule = useAppStore((state) => state.activeMonitoringModule);
  const setActiveModule = useAppStore((state) => state.setActiveMonitoringModule);
  const activeUnit = useAppStore((state) => state.activeUnit);
  const curriculumMappings = useAppStore((state) => state.curriculumMappings);

  const unitMetrics = useMemo(() => {
    if (!activeUnit) return [];
    return curriculumMappings.filter((m) => m.unit_code === activeUnit);
  }, [activeUnit, curriculumMappings]);

  const metricsByModule = useMemo(() => {
    if (unitMetrics.length === 0) return null;

    const grouped = {
      cokewatch: unitMetrics.filter((m) =>
        ['aqi', 'benzene', 'wind', 'co', 'no2', 'ozone', 'pm25', 'so2', 'voc', 'temperature'].includes(m.target_metric)
      ),
      pfas: unitMetrics.filter((m) =>
        ['pfas', 'epa_limit', 'filter_life', 'ph', 'lead', 'heavy_metals', 'turbidity', 'dissolved_oxygen'].includes(m.target_metric)
      ),
      carbon: unitMetrics.filter((m) =>
        ['carbon', 'emissions', 'carbon_capture', 'greenhouse_gas', 'atmospheric'].includes(m.target_metric)
      ),
    };

    return grouped;
  }, [unitMetrics]);

  return (
    <div className="space-y-6">
      {activeUnit && unitMetrics.length > 0 && (
        <div className="bg-gradient-to-r from-accent-900/20 to-primary-900/20 border border-accent-800/30 rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-accent-600 text-white rounded-full p-2">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  {activeUnit} Active
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {unitMetrics.length} metric{unitMetrics.length !== 1 ? 's' : ''} available across modules. Hover over boxes with sparkle icons to see chemistry connections.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              {metricsByModule && (
                <>
                  {metricsByModule.cokewatch.length > 0 && (
                    <div className="text-center">
                      <div className="text-accent-400 font-bold">{metricsByModule.cokewatch.length}</div>
                      <div className="text-gray-500">CokeWatch</div>
                    </div>
                  )}
                  {metricsByModule.pfas.length > 0 && (
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{metricsByModule.pfas.length}</div>
                      <div className="text-gray-500">PFAS-Check</div>
                    </div>
                  )}
                  {metricsByModule.carbon.length > 0 && (
                    <div className="text-center">
                      <div className="text-orange-400 font-bold">{metricsByModule.carbon.length}</div>
                      <div className="text-gray-500">CarbonSink</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-4 border-b border-dark-700">
        <button
          onClick={() => setActiveModule('cokewatch')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors relative ${
            activeModule === 'cokewatch'
              ? 'border-accent-500 text-accent-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          <span>CokeWatch</span>
          {metricsByModule && metricsByModule.cokewatch.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-accent-600 text-white text-xs rounded-full">
              {metricsByModule.cokewatch.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveModule('pfas')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors relative ${
            activeModule === 'pfas'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          <span>PFAS-Check</span>
          {metricsByModule && metricsByModule.pfas.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {metricsByModule.pfas.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveModule('carbon')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors relative ${
            activeModule === 'carbon'
              ? 'border-orange-500 text-orange-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          <span>CarbonSink AL</span>
          {metricsByModule && metricsByModule.carbon.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-orange-600 text-white text-xs rounded-full">
              {metricsByModule.carbon.length}
            </span>
          )}
        </button>
      </div>

      <div>
        {activeModule === 'cokewatch' && <CokeWatch />}
        {activeModule === 'pfas' && <PFASCheck />}
        {activeModule === 'carbon' && <CarbonSinkAL />}
      </div>
    </div>
  );
}
