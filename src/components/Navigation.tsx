import { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, Activity, AlertCircle, Users, Settings, ChevronDown, Beaker, Database, Eye, BookOpen } from 'lucide-react';
import { useAppStore } from '../store';
import type { APChemUnit } from '../types';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  { id: 'violations', label: 'Violations', icon: AlertCircle },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'data-guide', label: 'Data Guide', icon: BookOpen },
] as const;

const getModuleForMetric = (metric: string): 'cokewatch' | 'pfas' | 'carbon' => {
  const cokewatchMetrics = ['aqi', 'benzene', 'wind', 'co', 'no2', 'ozone', 'pm25', 'so2', 'voc', 'temperature'];
  const pfasMetrics = ['pfas', 'epa_limit', 'filter_life', 'ph', 'lead', 'heavy_metals', 'turbidity', 'dissolved_oxygen'];
  const carbonMetrics = ['carbon', 'emissions', 'carbon_capture', 'greenhouse_gas', 'atmospheric'];

  if (cokewatchMetrics.includes(metric)) return 'cokewatch';
  if (pfasMetrics.includes(metric)) return 'pfas';
  if (carbonMetrics.includes(metric)) return 'carbon';

  return 'cokewatch';
};

export function Navigation() {
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const currentTab = useAppStore((state) => state.currentTab);
  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const activeUnit = useAppStore((state) => state.activeUnit);
  const setActiveUnit = useAppStore((state) => state.setActiveUnit);
  const setHighlightedMetric = useAppStore((state) => state.setHighlightedMetric);
  const setActiveMonitoringModule = useAppStore((state) => state.setActiveMonitoringModule);
  const isAdminMode = useAppStore((state) => state.isAdminMode);
  const setIsAdminMode = useAppStore((state) => state.setIsAdminMode);
  const curriculumMappings = useAppStore((state) => state.curriculumMappings);

  const apChemUnits = useMemo(() => {
    const uniqueUnits = Array.from(
      new Set(curriculumMappings.map((mapping) => mapping.unit_code))
    ).sort();

    return uniqueUnits.map((unitCode) => {
      const unitMappings = curriculumMappings.filter((m) => m.unit_code === unitCode);
      const firstMapping = unitMappings[0];
      const topics = Array.from(new Set(unitMappings.map(m => m.topic_title)));

      return {
        id: unitCode as APChemUnit,
        label: topics.length > 0 ? `${unitCode}: ${topics[0]}` : unitCode,
        concept: firstMapping?.chemistry_concept || 'Chemistry Concepts',
        mappingCount: unitMappings.length,
      };
    });
  }, [curriculumMappings]);

  const handleUnitSelect = (unit: APChemUnit) => {
    setActiveUnit(unit);
    setCurrentTab('monitoring');
    setShowAdminDropdown(false);

    const unitMappings = curriculumMappings.filter((m) => m.unit_code === unit);
    if (unitMappings.length > 0) {
      const firstMetric = unitMappings[0].target_metric;
      const module = getModuleForMetric(firstMetric);

      setActiveMonitoringModule(module);
      setHighlightedMetric(firstMetric);

      setTimeout(() => {
        setHighlightedMetric(null);
      }, 3000);
    }
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    setCurrentTab('admin');
    setShowAdminDropdown(false);
  };

  return (
    <nav className="bg-dark-900 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors
                    ${
                      isActive
                        ? 'border-primary-500 text-primary-500'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowAdminDropdown(!showAdminDropdown)}
              className={`
                flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors
                ${
                  currentTab === 'admin'
                    ? 'border-accent-500 text-accent-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }
              `}
            >
              <Settings className="w-4 h-4" />
              <span>Knowledge</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdminDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showAdminDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50 max-h-[32rem] overflow-y-auto">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                    <span>AP Chemistry Units</span>
                    <span className="text-accent-400">{apChemUnits.length} units</span>
                  </div>
                  {apChemUnits.length === 0 ? (
                    <div className="px-3 py-6 text-center">
                      <Beaker className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No units configured</p>
                      <p className="text-xs text-gray-600 mt-1">Add curriculum mappings in Admin</p>
                    </div>
                  ) : (
                    apChemUnits.map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => handleUnitSelect(unit.id)}
                        className={`
                          w-full flex items-start space-x-3 px-3 py-2 rounded-md transition-colors text-left
                          ${
                            activeUnit === unit.id
                              ? 'bg-accent-900/30 text-accent-400'
                              : 'text-gray-300 hover:bg-dark-700'
                          }
                        `}
                      >
                        <Beaker className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{unit.label}</div>
                          <div className="text-xs text-gray-500">{unit.concept}</div>
                        </div>
                        <div className="text-xs text-accent-500 font-medium mt-0.5">
                          {unit.mappingCount}
                        </div>
                      </button>
                    ))
                  )}

                  <div className="border-t border-dark-700 my-2"></div>

                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Controls
                  </div>

                  <button
                    onClick={toggleAdminMode}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-gray-300 hover:bg-dark-700"
                  >
                    <Database className="w-4 h-4" />
                    <span className="text-sm">Admin Configuration</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveUnit(null);
                      setShowAdminDropdown(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-left text-gray-300 hover:bg-dark-700"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Student View Mode</span>
                  </button>
                </div>

                {activeUnit && (
                  <div className="bg-accent-900/20 border-t border-accent-800/30 px-4 py-3">
                    <div className="text-xs text-accent-400 font-medium">Active: {activeUnit}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Hover over widgets to see chemistry concepts
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
