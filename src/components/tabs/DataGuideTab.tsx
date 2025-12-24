import {
  Database,
  Cloud,
  Lock,
  Zap,
  User,
  Wind,
  Droplets,
  MapPin,
  Waves,
  Bird,
  Trees,
  Leaf,
  Beaker,
  Users,
  AlertCircle,
  CheckCircle,
  Key,
  Code,
  FileJson,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';

interface DatabaseInfo {
  id: string;
  name: string;
  icon: any;
  description: string;
  tableName: string;
  dataSource: 'api' | 'manual' | 'both';
  apiName?: string;
  apiUrl?: string;
  authRequired: 'none' | 'api_key' | 'oauth';
  authInstructions?: string;
  automation: 'full' | 'semi' | 'manual';
  automationInstructions: string;
  relatedModules: string[];
  sampleFields: string[];
  color: string;
}

const databases: DatabaseInfo[] = [
  {
    id: 'air_quality',
    name: 'Air Quality Monitoring',
    icon: Wind,
    description: 'Real-time air quality data including PM2.5, PM10, ozone, NO₂, SO₂, CO, and AQI from EPA monitoring stations',
    tableName: 'air_quality_data',
    dataSource: 'api',
    apiName: 'AirNow API',
    apiUrl: 'https://www.airnowapi.org/',
    authRequired: 'api_key',
    authInstructions: 'Register at docs.airnowapi.org for a free API key. Add to .env as VITE_AIRNOW_API_KEY',
    automation: 'full',
    automationInstructions: 'Set up cron job to fetch data every 15 minutes. Use fetchAirNowData() function from environmentalApi.ts',
    relatedModules: ['CokeWatch', 'All Projects Overview'],
    sampleFields: ['aqi', 'pm25', 'pm10', 'ozone', 'no2', 'so2', 'co', 'benzene', 'voc', 'temperature'],
    color: 'text-accent-500',
  },
  {
    id: 'water_quality',
    name: 'Surface & Groundwater Quality',
    icon: Droplets,
    description: 'Water quality measurements including pH, dissolved oxygen, PFAS, nutrients, and E. coli counts',
    tableName: 'water_quality_data',
    dataSource: 'both',
    apiName: 'USGS Water Services',
    apiUrl: 'https://waterservices.usgs.gov/',
    authRequired: 'none',
    authInstructions: 'No authentication required. Data is publicly available.',
    automation: 'full',
    automationInstructions: 'Fetch every 15 minutes using fetchUSGSWaterData(). Also supports manual citizen scientist entries.',
    relatedModules: ['PFAS-Check', 'All Projects Overview'],
    sampleFields: ['ph', 'dissolved_oxygen', 'temperature', 'turbidity', 'pfas_total', 'pfos', 'pfoa', 'lead', 'ecoli_count'],
    color: 'text-blue-500',
  },
  {
    id: 'groundwater',
    name: 'Groundwater Wells & Levels',
    icon: MapPin,
    description: 'Groundwater monitoring wells and water table depth measurements for aquifer tracking',
    tableName: 'groundwater_wells, groundwater_levels',
    dataSource: 'both',
    apiName: 'USGS Water Services',
    apiUrl: 'https://waterservices.usgs.gov/',
    authRequired: 'none',
    authInstructions: 'No authentication required. USGS provides free groundwater level data.',
    automation: 'semi',
    automationInstructions: 'Well registry requires manual setup. Level measurements can be automated or manually entered.',
    relatedModules: ['Groundwater Module (coming soon)', 'All Projects Overview'],
    sampleFields: ['well_depth', 'aquifer_name', 'water_table_depth', 'water_elevation', 'measurement_method'],
    color: 'text-cyan-500',
  },
  {
    id: 'coastal',
    name: 'Coastal & Beach Monitoring',
    icon: Waves,
    description: 'Beach water quality including enterococci bacteria counts for swimming advisories at Gulf Coast locations',
    tableName: 'coastal_monitoring',
    dataSource: 'manual',
    authRequired: 'none',
    automation: 'manual',
    automationInstructions: 'Data must be manually entered from Alabama Department of Public Health beach monitoring reports. Weekly sampling during swimming season.',
    relatedModules: ['Coastal Module (coming soon)', 'All Projects Overview'],
    sampleFields: ['enterococci_count', 'swimming_advisory', 'water_temperature', 'salinity', 'wave_height', 'tide_level'],
    color: 'text-teal-500',
  },
  {
    id: 'wildlife',
    name: 'Wildlife & Biodiversity',
    icon: Bird,
    description: 'Species observations and habitat tracking with iNaturalist integration for citizen science',
    tableName: 'wildlife_observations',
    dataSource: 'both',
    apiName: 'iNaturalist API',
    apiUrl: 'https://api.inaturalist.org/',
    authRequired: 'none',
    authInstructions: 'iNaturalist API is open. OAuth optional for posting observations on behalf of users.',
    automation: 'semi',
    automationInstructions: 'Can fetch public observations automatically. Manual entry supported for field observations.',
    relatedModules: ['Wildlife Module (coming soon)', 'Community Tab', 'All Projects Overview'],
    sampleFields: ['species_name', 'common_name', 'scientific_name', 'count', 'habitat_type', 'observation_method'],
    color: 'text-green-500',
  },
  {
    id: 'forest',
    name: 'Forest Health Assessment',
    icon: Trees,
    description: 'Tree measurements, species identification, and canopy coverage across Alabama forestland',
    tableName: 'forest_assessments, tree_measurements',
    dataSource: 'manual',
    authRequired: 'none',
    automation: 'manual',
    automationInstructions: 'Field data collection required. Use mobile forms for on-site data entry during forest surveys.',
    relatedModules: ['Forest Module (coming soon)', 'All Projects Overview'],
    sampleFields: ['forest_type', 'canopy_coverage_percent', 'tree_species', 'dbh', 'height', 'health_status'],
    color: 'text-emerald-500',
  },
  {
    id: 'wetland',
    name: 'Wetland Condition',
    icon: Leaf,
    description: 'Wetland classification, hydrology regime, and habitat quality using National Wetlands Inventory codes',
    tableName: 'wetland_assessments',
    dataSource: 'manual',
    authRequired: 'none',
    automation: 'manual',
    automationInstructions: 'Requires field assessment by trained personnel. Document wetland type, vegetation, and disturbances.',
    relatedModules: ['Wetland Module (coming soon)', 'All Projects Overview'],
    sampleFields: ['wetland_type', 'hydrology_regime', 'dominant_vegetation', 'habitat_quality_score', 'disturbance_indicators'],
    color: 'text-lime-500',
  },
  {
    id: 'soil',
    name: 'Soil Quality Monitoring',
    icon: Beaker,
    description: 'Soil chemistry including pH, nutrients, organic matter, and heavy metal concentrations',
    tableName: 'soil_samples',
    dataSource: 'manual',
    authRequired: 'none',
    automation: 'manual',
    automationInstructions: 'Samples must be collected in field and analyzed in lab. Enter results manually with lab analysis ID.',
    relatedModules: ['Soil Module (coming soon)', 'All Projects Overview'],
    sampleFields: ['ph', 'organic_matter_percent', 'nitrogen_ppm', 'phosphorus_ppm', 'lead_ppm', 'texture_classification'],
    color: 'text-amber-500',
  },
  {
    id: 'weather',
    name: 'Weather Station Network',
    icon: Cloud,
    description: 'Meteorological data including temperature, humidity, precipitation, and wind measurements',
    tableName: 'weather_data, weather_stations',
    dataSource: 'api',
    apiName: 'National Weather Service API',
    apiUrl: 'https://api.weather.gov/',
    authRequired: 'none',
    authInstructions: 'No API key required. Only needs User-Agent header: (AlabamaEnvMonitor, contact@school.edu)',
    automation: 'full',
    automationInstructions: 'Fetch weather data hourly using fetchNWSForecast(). Real-time alerts via fetchNWSAlerts().',
    relatedModules: ['Weather Station', 'All Projects Overview'],
    sampleFields: ['temperature', 'humidity', 'pressure', 'wind_speed', 'precipitation', 'solar_radiation', 'uv_index'],
    color: 'text-sky-500',
  },
  {
    id: 'citizen',
    name: 'Citizen Science Reports',
    icon: Users,
    description: 'Community-submitted environmental observations including odors, visual pollution, and health concerns',
    tableName: 'citizen_reports',
    dataSource: 'manual',
    authRequired: 'none',
    automation: 'manual',
    automationInstructions: 'Users submit reports through the Community tab. Photos can be attached. Verification by administrators.',
    relatedModules: ['Community Tab', 'All Projects Overview'],
    sampleFields: ['report_type', 'severity', 'description', 'location', 'photos', 'verification_status'],
    color: 'text-purple-500',
  },
  {
    id: 'violations',
    name: 'Environmental Violations',
    icon: AlertCircle,
    description: 'EPA enforcement actions, facility violations, penalties, and compliance status tracking',
    tableName: 'environmental_violations',
    dataSource: 'api',
    apiName: 'EPA ECHO (Enforcement & Compliance)',
    apiUrl: 'https://echo.epa.gov/',
    authRequired: 'none',
    authInstructions: 'EPA ECHO data is public. Can be accessed via web interface or bulk download.',
    automation: 'semi',
    automationInstructions: 'Monthly bulk data import recommended. Some manual verification required for accuracy.',
    relatedModules: ['Violations Tab', 'All Projects Overview'],
    sampleFields: ['company_name', 'violation_type', 'penalty_amount', 'status', 'severity', 'epa_case_number'],
    color: 'text-red-500',
  },
  {
    id: 'facilities',
    name: 'Industrial Facilities',
    icon: Database,
    description: 'Industrial facility registry with locations, permits, emissions data, and compliance history',
    tableName: 'facilities',
    dataSource: 'api',
    apiName: 'EPA Facility Registry Service',
    apiUrl: 'https://www.epa.gov/frs',
    authRequired: 'none',
    authInstructions: 'EPA facility data is publicly available. Bulk download or API access available.',
    automation: 'semi',
    automationInstructions: 'Initial bulk import, then quarterly updates. Manual verification of local facilities recommended.',
    relatedModules: ['Violations Tab', 'Overview Tab', 'All Projects Overview'],
    sampleFields: ['facility_name', 'location', 'facility_type', 'industry_sector', 'compliance_status', 'emissions'],
    color: 'text-orange-500',
  },
];

export function DataGuideTab() {
  const [selectedDb, setSelectedDb] = useState<DatabaseInfo | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Database & API Integration Guide</h2>
        <p className="text-gray-400">
          Complete guide for populating databases, connecting APIs, and automating data collection
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary-900/20 to-blue-900/20 border border-primary-800/30 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-1">7</div>
            <div className="text-sm text-gray-400">Free APIs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-1">12</div>
            <div className="text-sm text-gray-400">Database Tables</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-500 mb-1">5</div>
            <div className="text-sm text-gray-400">Fully Automated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500 mb-1">$0</div>
            <div className="text-sm text-gray-400">Monthly Cost</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Select Database</h3>
          <div className="space-y-2">
            {databases.map((db) => {
              const Icon = db.icon;
              return (
                <button
                  key={db.id}
                  onClick={() => setSelectedDb(db)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all text-left ${
                    selectedDb?.id === db.id
                      ? 'bg-dark-700 border-primary-600'
                      : 'bg-dark-800 border-dark-700 hover:border-primary-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${db.color}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{db.name}</div>
                    <div className="text-xs text-gray-500">{db.tableName}</div>
                  </div>
                  {db.dataSource === 'api' && (
                    <Zap className="w-4 h-4 text-green-500" />
                  )}
                  {db.dataSource === 'both' && (
                    <Zap className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedDb ? (
            <div className="space-y-6">
              <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const Icon = selectedDb.icon;
                      return <Icon className={`w-8 h-8 ${selectedDb.color}`} />;
                    })()}
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedDb.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">Table: {selectedDb.tableName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedDb.dataSource === 'api' && (
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">API</span>
                    )}
                    {selectedDb.dataSource === 'manual' && (
                      <span className="px-2 py-1 bg-gray-900/30 text-gray-400 text-xs rounded">Manual</span>
                    )}
                    {selectedDb.dataSource === 'both' && (
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded">Hybrid</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">{selectedDb.description}</p>
              </div>

              {selectedDb.apiName && (
                <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Cloud className="w-5 h-5 text-blue-500" />
                    <h4 className="text-lg font-semibold text-white">API Connection</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-400 mb-1">API Name</div>
                      <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded">
                        <span className="text-white">{selectedDb.apiName}</span>
                        {selectedDb.apiUrl && (
                          <a
                            href={selectedDb.apiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-500 hover:text-primary-400 flex items-center space-x-1"
                          >
                            <span className="text-xs">Visit</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-400 mb-1">Authentication</div>
                      <div className="p-3 bg-dark-700/50 rounded">
                        <div className="flex items-center space-x-2 mb-2">
                          {selectedDb.authRequired === 'none' ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-400 font-medium">No Authentication Required</span>
                            </>
                          ) : selectedDb.authRequired === 'api_key' ? (
                            <>
                              <Key className="w-4 h-4 text-yellow-500" />
                              <span className="text-yellow-400 font-medium">API Key Required (Free)</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 text-orange-500" />
                              <span className="text-orange-400 font-medium">OAuth Required</span>
                            </>
                          )}
                        </div>
                        {selectedDb.authInstructions && (
                          <p className="text-sm text-gray-300">{selectedDb.authInstructions}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-400 mb-1">Automation Level</div>
                      <div className="p-3 bg-dark-700/50 rounded">
                        <div className="flex items-center space-x-2 mb-2">
                          {selectedDb.automation === 'full' ? (
                            <>
                              <Zap className="w-4 h-4 text-green-500" />
                              <span className="text-green-400 font-medium">Fully Automated</span>
                            </>
                          ) : selectedDb.automation === 'semi' ? (
                            <>
                              <Zap className="w-4 h-4 text-blue-500" />
                              <span className="text-blue-400 font-medium">Semi-Automated</span>
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-400 font-medium">Manual Entry Only</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-300">{selectedDb.automationInstructions}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileJson className="w-5 h-5 text-accent-500" />
                  <h4 className="text-lg font-semibold text-white">Data Fields</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedDb.sampleFields.map((field) => (
                    <span
                      key={field}
                      className="px-3 py-1 bg-dark-700 border border-dark-600 text-gray-300 text-xs rounded-full"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Code className="w-5 h-5 text-primary-500" />
                  <h4 className="text-lg font-semibold text-white">Related App Modules</h4>
                </div>
                <div className="space-y-2">
                  {selectedDb.relatedModules.map((module) => (
                    <div
                      key={module}
                      className="flex items-center space-x-2 p-2 bg-dark-700/30 rounded"
                    >
                      <CheckCircle className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-300 text-sm">{module}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-12 text-center">
              <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Select a Database</h3>
              <p className="text-gray-400">
                Choose a database from the list to view integration details, API configuration, and automation options
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-800/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Start Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <h4 className="font-medium text-white">Setup API Keys</h4>
            </div>
            <p className="text-sm text-gray-300 ml-8">
              Register for free API keys from AirNow and any other services. Add keys to your .env file.
            </p>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <h4 className="font-medium text-white">Configure Automation</h4>
            </div>
            <p className="text-sm text-gray-300 ml-8">
              Set up cron jobs or scheduled functions in vercel.json to fetch data at specified intervals.
            </p>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <h4 className="font-medium text-white">Manual Data Entry</h4>
            </div>
            <p className="text-sm text-gray-300 ml-8">
              Use provided forms in Community tab and data modules for field observations and lab results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
