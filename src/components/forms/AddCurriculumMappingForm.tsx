import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { CurriculumMapping } from '../../types';

interface AddCurriculumMappingFormProps {
  onClose: () => void;
  onSuccess: (mapping: CurriculumMapping) => void;
}

export function AddCurriculumMappingForm({ onClose, onSuccess }: AddCurriculumMappingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    unit_code: '',
    topic_title: '',
    popup_content: '',
    target_metric: '',
    chemistry_concept: '',
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.unit_code.trim() || !formData.topic_title.trim() || !formData.popup_content.trim() || !formData.target_metric.trim() || !formData.chemistry_concept.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error: insertError } = await supabase
        .from('curriculum_mapping')
        .insert([formData])
        .select()
        .single();

      if (insertError) throw insertError;

      onSuccess(data as CurriculumMapping);
      onClose();
    } catch (err) {
      console.error('Error adding mapping:', err);
      setError(err instanceof Error ? err.message : 'Failed to add mapping');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-dark-800 border-b border-dark-700 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Add Curriculum Mapping</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Unit Code *
              </label>
              <select
                name="unit_code"
                value={formData.unit_code}
                onChange={handleChange}
                required
                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                <option value="">Select a unit...</option>
                <option value="Unit 3.1">Unit 3.1</option>
                <option value="Unit 3.2">Unit 3.2</option>
                <option value="Unit 3.3">Unit 3.3</option>
                <option value="Unit 5">Unit 5</option>
                <option value="Unit 7">Unit 7</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Topic Title *
              </label>
              <input
                type="text"
                name="topic_title"
                value={formData.topic_title}
                onChange={handleChange}
                placeholder="e.g., Intermolecular Forces in Benzene"
                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Target Metric *
              </label>
              <select
                name="target_metric"
                value={formData.target_metric}
                onChange={handleChange}
                required
                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                <option value="">Select a metric...</option>
                <optgroup label="Air Quality">
                  <option value="aqi">Air Quality Index (AQI)</option>
                  <option value="benzene">Benzene</option>
                  <option value="co">Carbon Monoxide (CO)</option>
                  <option value="no2">Nitrogen Dioxide (NO2)</option>
                  <option value="ozone">Ozone (O3)</option>
                  <option value="pm25">PM2.5 (Particulate Matter)</option>
                  <option value="so2">Sulfur Dioxide (SO2)</option>
                  <option value="voc">Volatile Organic Compounds (VOCs)</option>
                </optgroup>
                <optgroup label="Water Quality">
                  <option value="pfas">PFAS</option>
                  <option value="ph">pH</option>
                  <option value="lead">Lead</option>
                  <option value="heavy_metals">Heavy Metals</option>
                  <option value="turbidity">Turbidity</option>
                  <option value="dissolved_oxygen">Dissolved Oxygen</option>
                </optgroup>
                <optgroup label="Climate & Carbon">
                  <option value="carbon">Carbon (CO2)</option>
                  <option value="carbon_capture">Carbon Capture Technology</option>
                  <option value="emissions">Industrial Emissions</option>
                  <option value="greenhouse_gas">Greenhouse Gas Effects</option>
                </optgroup>
                <optgroup label="Environmental Processes">
                  <option value="acid_rain">Acid Rain</option>
                  <option value="atmospheric">Atmospheric Chemistry</option>
                  <option value="filter_life">Filter Life & Adsorption</option>
                  <option value="redox">Redox Reactions in Pollution</option>
                  <option value="temperature">Temperature Effects</option>
                  <option value="wind">Wind Patterns</option>
                </optgroup>
                <optgroup label="Regulatory & Standards">
                  <option value="epa_limit">EPA Safety Limits</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Chemistry Concept *
              </label>
              <input
                type="text"
                name="chemistry_concept"
                value={formData.chemistry_concept}
                onChange={handleChange}
                placeholder="e.g., Intermolecular Forces"
                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Educational Content *
              </label>
              <textarea
                name="popup_content"
                value={formData.popup_content}
                onChange={handleChange}
                placeholder="Enter the educational content that will appear in the popup..."
                rows={5}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 rounded border-dark-600 text-accent-600 focus:ring-accent-500 cursor-pointer"
              />
              <label htmlFor="is_active" className="text-sm font-semibold text-gray-300 cursor-pointer">
                Active (Enable immediately)
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-dark-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center space-x-2 bg-accent-600 hover:bg-accent-700 disabled:bg-dark-600 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>{isSubmitting ? 'Adding...' : 'Add Mapping'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 bg-dark-700 hover:bg-dark-600 text-gray-300 font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
