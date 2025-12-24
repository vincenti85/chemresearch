import { useState } from 'react';
import {
  X,
  MapPin,
  Building2,
  AlertTriangle,
  Shield,
  Wind,
  Droplets,
  Leaf,
  Volume2,
  Trash2,
  Factory,
  Plus,
  Minus,
  User,
  Save,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ReportSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Measurement {
  type: string;
  value: string;
  unit: string;
  method: string;
}

const categories = [
  { id: 'air_quality', label: 'Air Quality', icon: Wind, color: 'text-sky-500' },
  { id: 'water_quality', label: 'Water Quality', icon: Droplets, color: 'text-blue-500' },
  { id: 'soil_contamination', label: 'Soil Contamination', icon: Leaf, color: 'text-green-500' },
  { id: 'noise_pollution', label: 'Noise Pollution', icon: Volume2, color: 'text-purple-500' },
  { id: 'hazardous_waste', label: 'Hazardous Waste', icon: Trash2, color: 'text-red-500' },
  { id: 'illegal_dumping', label: 'Illegal Dumping', icon: Trash2, color: 'text-orange-500' },
  { id: 'emissions_violation', label: 'Emissions Violation', icon: Factory, color: 'text-gray-500' },
  { id: 'discharge_violation', label: 'Discharge Violation', icon: Droplets, color: 'text-cyan-500' },
  { id: 'permit_violation', label: 'Permit Violation', icon: Shield, color: 'text-amber-500' },
  { id: 'other', label: 'Other', icon: AlertTriangle, color: 'text-gray-400' },
];

const measurementTypes = [
  { category: 'air_quality', types: ['PM2.5', 'PM10', 'Ozone', 'NO2', 'SO2', 'CO', 'Benzene', 'VOC'] },
  { category: 'water_quality', types: ['pH', 'Dissolved Oxygen', 'Turbidity', 'PFAS', 'Lead', 'Nitrate', 'Phosphate', 'E. coli'] },
  { category: 'soil_contamination', types: ['Lead', 'Arsenic', 'Mercury', 'pH', 'Organic Matter', 'Nitrogen'] },
  { category: 'noise_pollution', types: ['Decibels (dB)', 'Duration (minutes)'] },
  { category: 'hazardous_waste', types: ['Volume (gallons)', 'Weight (lbs)', 'Container Count'] },
];

export function ReportSubmissionForm({ isOpen, onClose, onSuccess }: ReportSubmissionFormProps) {
  const [classification, setClassification] = useState<'hazard' | 'violation'>('hazard');
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    county: '',
    region: '',
    latitude: '',
    longitude: '',
    organizationName: '',
    organizationType: 'unknown' as 'industrial' | 'commercial' | 'government' | 'residential' | 'unknown',
    issueDescription: '',
    impactDescription: '',
    severity: 3,
    submitterName: '',
    submitterEmail: '',
    submitterPhone: '',
    isAnonymous: false,
    followUpRequested: false,
  });
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddMeasurement = () => {
    setMeasurements([...measurements, { type: '', value: '', unit: '', method: '' }]);
  };

  const handleRemoveMeasurement = (index: number) => {
    setMeasurements(measurements.filter((_, i) => i !== index));
  };

  const handleMeasurementChange = (index: number, field: keyof Measurement, value: string) => {
    const newMeasurements = [...measurements];
    newMeasurements[index][field] = value;
    setMeasurements(newMeasurements);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!category) {
        throw new Error('Please select a category');
      }

      if (!formData.issueDescription) {
        throw new Error('Please provide an issue description');
      }

      let location = null;
      if (formData.latitude && formData.longitude) {
        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          location = `POINT(${lng} ${lat})`;
        }
      }

      const reportData = {
        report_classification: classification,
        category,
        location,
        address: formData.address || null,
        city: formData.city || null,
        county: formData.county || null,
        region: formData.region || null,
        organization_name: formData.organizationName || null,
        organization_type: formData.organizationType,
        issue_description: formData.issueDescription,
        impact_description: formData.impactDescription || null,
        severity: formData.severity,
        submitter_name: formData.isAnonymous ? null : formData.submitterName || null,
        submitter_email: formData.isAnonymous ? null : formData.submitterEmail || null,
        submitter_phone: formData.isAnonymous ? null : formData.submitterPhone || null,
        is_anonymous: formData.isAnonymous,
        follow_up_requested: formData.followUpRequested,
        status: 'pending',
      };

      const { data: report, error: reportError } = await supabase
        .from('detailed_reports')
        .insert(reportData)
        .select()
        .single();

      if (reportError) throw reportError;

      if (measurements.length > 0 && report) {
        const measurementData = measurements
          .filter(m => m.type && m.value && m.unit)
          .map(m => ({
            report_id: report.id,
            measurement_type: m.type,
            measurement_value: parseFloat(m.value) || 0,
            measurement_unit: m.unit,
            measurement_method: m.method || null,
          }));

        if (measurementData.length > 0) {
          const { error: measurementError } = await supabase
            .from('report_measurements')
            .insert(measurementData);

          if (measurementError) throw measurementError;
        }
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
      console.error('Error submitting report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setClassification('hazard');
    setCategory('');
    setFormData({
      address: '',
      city: '',
      county: '',
      region: '',
      latitude: '',
      longitude: '',
      organizationName: '',
      organizationType: 'unknown',
      issueDescription: '',
      impactDescription: '',
      severity: 3,
      submitterName: '',
      submitterEmail: '',
      submitterPhone: '',
      isAnonymous: false,
      followUpRequested: false,
    });
    setMeasurements([]);
    setError('');
  };

  const getAvailableMeasurementTypes = () => {
    const found = measurementTypes.find(m => m.category === category);
    return found ? found.types : [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-dark-800 border border-dark-700 rounded-xl max-w-4xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-2xl font-bold text-white">Submit Environmental Report</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Report Classification
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setClassification('hazard')}
                className={`p-4 rounded-lg border transition-all ${
                  classification === 'hazard'
                    ? 'bg-orange-900/30 border-orange-600 text-orange-400'
                    : 'bg-dark-700 border-dark-600 text-gray-400 hover:border-dark-500'
                }`}
              >
                <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Environmental Hazard</div>
                <div className="text-xs mt-1">Potential danger or risk</div>
              </button>
              <button
                type="button"
                onClick={() => setClassification('violation')}
                className={`p-4 rounded-lg border transition-all ${
                  classification === 'violation'
                    ? 'bg-red-900/30 border-red-600 text-red-400'
                    : 'bg-dark-700 border-dark-600 text-gray-400 hover:border-dark-500'
                }`}
              >
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Regulatory Violation</div>
                <div className="text-xs mt-1">Breaking environmental laws</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      category === cat.id
                        ? 'bg-primary-900/30 border-primary-600'
                        : 'bg-dark-700 border-dark-600 hover:border-dark-500'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${cat.color}`} />
                    <div className="text-xs text-gray-300">{cat.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-dark-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              <span>Location Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  placeholder="e.g., Birmingham"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">County</label>
                <input
                  type="text"
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  placeholder="e.g., Jefferson"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Region/Area</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  placeholder="e.g., North Birmingham"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Latitude</label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  placeholder="e.g., 33.5186"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Longitude</label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  placeholder="e.g., -86.8024"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-dark-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-accent-500" />
              <span>Organization Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organization/Company Name
                </label>
                <input
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  placeholder="If applicable"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organization Type
                </label>
                <select
                  value={formData.organizationType}
                  onChange={(e) => setFormData({ ...formData, organizationType: e.target.value as any })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="unknown">Unknown</option>
                  <option value="industrial">Industrial</option>
                  <option value="commercial">Commercial</option>
                  <option value="government">Government</option>
                  <option value="residential">Residential</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-dark-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Issue Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Issue Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.issueDescription}
                  onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                  rows={4}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  placeholder="Describe the environmental issue in detail..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Impact Description
                </label>
                <textarea
                  value={formData.impactDescription}
                  onChange={(e) => setFormData({ ...formData, impactDescription: e.target.value })}
                  rows={3}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                  placeholder="How is this affecting the community or environment?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Severity Level: {formData.severity}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Minor</span>
                  <span>Moderate</span>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          </div>

          {category && getAvailableMeasurementTypes().length > 0 && (
            <div className="border-t border-dark-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Measurements (Optional)</h3>
                <button
                  type="button"
                  onClick={handleAddMeasurement}
                  className="flex items-center space-x-2 text-primary-500 hover:text-primary-400 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Measurement</span>
                </button>
              </div>
              {measurements.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Add numeric measurements to support your report (e.g., pollutant levels, pH values)
                </p>
              ) : (
                <div className="space-y-3">
                  {measurements.map((measurement, index) => (
                    <div key={index} className="bg-dark-700/50 p-4 rounded-lg border border-dark-600">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Type</label>
                          <select
                            value={measurement.type}
                            onChange={(e) => handleMeasurementChange(index, 'type', e.target.value)}
                            className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-sm text-white"
                          >
                            <option value="">Select type</option>
                            {getAvailableMeasurementTypes().map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Value</label>
                          <input
                            type="number"
                            step="any"
                            value={measurement.value}
                            onChange={(e) => handleMeasurementChange(index, 'value', e.target.value)}
                            className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-sm text-white"
                            placeholder="0.0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Unit</label>
                          <input
                            type="text"
                            value={measurement.unit}
                            onChange={(e) => handleMeasurementChange(index, 'unit', e.target.value)}
                            className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-sm text-white"
                            placeholder="e.g., μg/m³"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveMeasurement(index)}
                            className="w-full bg-red-900/20 hover:bg-red-900/30 border border-red-800 text-red-400 px-3 py-2 rounded text-sm transition-colors"
                          >
                            <Minus className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs text-gray-400 mb-1">Method (Optional)</label>
                        <input
                          type="text"
                          value={measurement.method}
                          onChange={(e) => handleMeasurementChange(index, 'method', e.target.value)}
                          className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-sm text-white"
                          placeholder="How was this measured?"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-dark-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-500" />
              <span>Your Information</span>
            </h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-600 bg-dark-700"
                />
                <span className="text-sm text-gray-300">Submit anonymously</span>
              </label>

              {!formData.isAnonymous && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.submitterName}
                      onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.submitterEmail}
                      onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.submitterPhone}
                      onChange={(e) => setFormData({ ...formData, submitterPhone: e.target.value })}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                      placeholder="(205) 555-0100"
                    />
                  </div>
                </div>
              )}

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.followUpRequested}
                  onChange={(e) => setFormData({ ...formData, followUpRequested: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-600 bg-dark-700"
                />
                <span className="text-sm text-gray-300">I would like to receive follow-up information</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-dark-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-dark-600 text-gray-300 rounded-lg hover:bg-dark-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
