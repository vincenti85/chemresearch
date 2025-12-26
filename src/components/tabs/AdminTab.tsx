import { useEffect, useState } from 'react';
import { Database, Beaker, Save, RefreshCw, Plus, ExternalLink, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AddCurriculumMappingForm } from '../forms/AddCurriculumMappingForm';
import { useAppStore } from '../../store';
import type { CurriculumMapping } from '../../types';

const getModuleForMetric = (metric: string): 'cokewatch' | 'pfas' | 'carbon' => {
  const cokewatchMetrics = ['aqi', 'benzene', 'wind', 'co', 'no2', 'ozone', 'pm25', 'so2', 'voc', 'temperature'];
  const pfasMetrics = ['pfas', 'epa_limit', 'filter_life', 'ph', 'lead', 'heavy_metals', 'turbidity', 'dissolved_oxygen'];
  const carbonMetrics = ['carbon', 'emissions', 'carbon_capture', 'greenhouse_gas', 'atmospheric'];

  if (cokewatchMetrics.includes(metric)) return 'cokewatch';
  if (pfasMetrics.includes(metric)) return 'pfas';
  if (carbonMetrics.includes(metric)) return 'carbon';

  return 'cokewatch';
};

export function AdminTab() {
  const [curriculumMappings, setCurriculumMappings] = useState<CurriculumMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [groupByUnit, setGroupByUnit] = useState(false);

  const setCurrentTab = useAppStore((state) => state.setCurrentTab);
  const setActiveUnit = useAppStore((state) => state.setActiveUnit);
  const setHighlightedMetric = useAppStore((state) => state.setHighlightedMetric);
  const setActiveMonitoringModule = useAppStore((state) => state.setActiveMonitoringModule);

  useEffect(() => {
    fetchCurriculumMappings();
  }, []);

  const fetchCurriculumMappings = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const { data, error } = await supabase
        .from('curriculum_mapping')
        .select('*')
        .order('unit_code');

      if (error) throw error;
      setCurriculumMappings(data as CurriculumMapping[]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch curriculum mappings';
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMappingActive = async (id: string, currentState: boolean) => {
    try {
      setIsSaving(true);
      setErrorMessage('');
      const { error } = await supabase
        .from('curriculum_mapping')
        .update({ is_active: !currentState })
        .eq('id', id);

      if (error) throw error;

      setCurriculumMappings(
        curriculumMappings.map((mapping) =>
          mapping.id === id ? { ...mapping, is_active: !currentState } : mapping
        )
      );

      setSuccessMessage('Mapping updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update mapping';
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMappingAdded = (newMapping: CurriculumMapping) => {
    setCurriculumMappings([...curriculumMappings, newMapping].sort((a, b) => a.unit_code.localeCompare(b.unit_code)));
    setSuccessMessage('Mapping added successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleNavigateToMapping = (mapping: CurriculumMapping) => {
    const module = getModuleForMetric(mapping.target_metric);

    setActiveUnit(mapping.unit_code as any);
    setActiveMonitoringModule(module);
    setHighlightedMetric(mapping.target_metric);
    setCurrentTab('monitoring');

    setTimeout(() => {
      setHighlightedMetric(null);
    }, 5000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 text-accent-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Admin Configuration</h2>
        <p className="text-gray-400">
          Manage AP Chemistry curriculum mappings and educational content settings
        </p>
      </div>

      {successMessage && (
        <div className="bg-primary-900/30 border border-primary-600 rounded-lg p-4 flex items-center space-x-3">
          <Save className="w-5 h-5 text-primary-500" />
          <span className="text-primary-400 font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="text-red-400 font-medium">{errorMessage}</span>
        </div>
      )}

      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-accent-500" />
            <h3 className="text-lg font-semibold text-white">Curriculum Mappings</h3>
            <span className="px-2 py-1 bg-accent-900/30 text-accent-400 text-xs rounded-md">
              {curriculumMappings.length} total
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setGroupByUnit(!groupByUnit)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                groupByUnit
                  ? 'bg-accent-600 text-white hover:bg-accent-700'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{groupByUnit ? 'Show All' : 'Group by Unit'}</span>
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Mapping</span>
            </button>
            <button
              onClick={fetchCurriculumMappings}
              className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {groupByUnit ? (
          <div className="space-y-6">
            {Array.from(new Set(curriculumMappings.map(m => m.unit_code)))
              .sort()
              .map((unitCode) => {
                const unitMappings = curriculumMappings.filter(m => m.unit_code === unitCode);
                return (
                  <div key={unitCode} className="space-y-3">
                    <div className="flex items-center space-x-3 pb-2 border-b border-accent-900/30">
                      <h4 className="text-lg font-bold text-accent-400">{unitCode}</h4>
                      <span className="text-sm text-gray-500">
                        {unitMappings.length} {unitMappings.length === 1 ? 'mapping' : 'mappings'}
                      </span>
                    </div>
                    {unitMappings.map((mapping) => (
                      <div
                        key={mapping.id}
                        className="bg-dark-900 border border-dark-700 rounded-lg p-5 hover:border-accent-600 transition-all cursor-pointer group"
                        onClick={() => handleNavigateToMapping(mapping)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            <Beaker className="w-5 h-5 text-accent-500 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-white font-semibold group-hover:text-accent-400 transition-colors">
                                  {mapping.topic_title}
                                </h4>
                                <span className="px-2 py-0.5 bg-accent-900/30 text-accent-400 text-xs rounded-md">
                                  {mapping.target_metric}
                                </span>
                                <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-accent-500 transition-colors" />
                              </div>
                              <p className="text-gray-500 text-sm italic">{mapping.chemistry_concept}</p>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMappingActive(mapping.id, mapping.is_active);
                            }}
                            disabled={isSaving}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex-shrink-0 ${
                              mapping.is_active
                                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                : 'bg-dark-700 hover:bg-dark-600 text-gray-400'
                            }`}
                          >
                            {mapping.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </div>

                        <div className="mt-3 pl-8">
                          <div className="bg-dark-800 rounded-lg p-3 border border-dark-700 group-hover:border-dark-600 transition-colors">
                            <div className="text-xs text-gray-500 mb-1">Educational Content:</div>
                            <p className="text-sm text-gray-300 leading-relaxed">{mapping.popup_content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="space-y-4">
            {curriculumMappings.map((mapping) => (
            <div
              key={mapping.id}
              className="bg-dark-900 border border-dark-700 rounded-lg p-5 hover:border-accent-600 transition-all cursor-pointer group"
              onClick={() => handleNavigateToMapping(mapping)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <Beaker className="w-5 h-5 text-accent-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-semibold group-hover:text-accent-400 transition-colors">
                        {mapping.unit_code}
                      </h4>
                      <span className="px-2 py-0.5 bg-accent-900/30 text-accent-400 text-xs rounded-md">
                        {mapping.target_metric}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-accent-500 transition-colors" />
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{mapping.topic_title}</p>
                    <p className="text-gray-500 text-sm italic">{mapping.chemistry_concept}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMappingActive(mapping.id, mapping.is_active);
                  }}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex-shrink-0 ${
                    mapping.is_active
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-dark-700 hover:bg-dark-600 text-gray-400'
                  }`}
                >
                  {mapping.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="mt-3 pl-8">
                <div className="bg-dark-800 rounded-lg p-3 border border-dark-700 group-hover:border-dark-600 transition-colors">
                  <div className="text-xs text-gray-500 mb-1">Educational Content:</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{mapping.popup_content}</p>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-accent-900/20 border border-accent-800/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-3">How to Use</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong>Click any mapping</strong> to navigate directly to the metric box</p>
            <p>• The system will switch to the Monitoring tab and highlight the box</p>
            <p>• Hover over highlighted boxes to see educational popups</p>
            <p>• Toggle mappings on/off to control available content</p>
            <p>• Select AP Chemistry units from navigation to filter content</p>
          </div>
        </div>

        <div className="bg-primary-900/20 border border-primary-800/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-3">Mapping Statistics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Mappings</span>
              <span className="text-2xl font-bold text-white">{curriculumMappings.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Active Mappings</span>
              <span className="text-2xl font-bold text-primary-400">
                {curriculumMappings.filter(m => m.is_active).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">AP Chem Units Covered</span>
              <span className="text-2xl font-bold text-accent-400">
                {new Set(curriculumMappings.map(m => m.unit_code)).size}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddCurriculumMappingForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleMappingAdded}
        />
      )}
    </div>
  );
}
