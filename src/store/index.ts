import { create } from 'zustand';
import type {
  PollutionData,
  Violation,
  CommunityReport,
  WaterQualityData,
  UserStats,
  TimeRange,
  Facility,
  CurriculumMapping,
  APChemUnit,
} from '../types';

interface AppState {
  currentTab: 'overview' | 'monitoring' | 'violations' | 'community' | 'data-guide' | 'admin';
  timeRange: TimeRange;
  pollutionData: PollutionData[];
  violations: Violation[];
  communityReports: CommunityReport[];
  waterQualityData: WaterQualityData[];
  facilities: Facility[];
  userStats: UserStats;
  isLoading: boolean;
  error: string | null;
  activeUnit: APChemUnit;
  curriculumMappings: CurriculumMapping[];
  highlightedMetric: string | null;
  isAdminMode: boolean;
  activeMonitoringModule: 'cokewatch' | 'pfas' | 'carbon';
  isReportFormOpen: boolean;

  setCurrentTab: (tab: AppState['currentTab']) => void;
  setTimeRange: (range: TimeRange) => void;
  setPollutionData: (data: PollutionData[]) => void;
  setViolations: (violations: Violation[]) => void;
  setCommunityReports: (reports: CommunityReport[]) => void;
  setWaterQualityData: (data: WaterQualityData[]) => void;
  setFacilities: (facilities: Facility[]) => void;
  setUserStats: (stats: UserStats) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveUnit: (unit: APChemUnit) => void;
  setCurriculumMappings: (mappings: CurriculumMapping[]) => void;
  setHighlightedMetric: (metric: string | null) => void;
  setIsAdminMode: (isAdmin: boolean) => void;
  setActiveMonitoringModule: (module: AppState['activeMonitoringModule']) => void;
  setIsReportFormOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentTab: 'overview',
  timeRange: '24h',
  pollutionData: [],
  violations: [],
  communityReports: [],
  waterQualityData: [],
  facilities: [],
  userStats: {
    activeUsers: 10247,
    totalReports: 1543,
    resolvedViolations: 89,
    monitoringSites: 47,
  },
  isLoading: false,
  error: null,
  activeUnit: null,
  curriculumMappings: [],
  highlightedMetric: null,
  isAdminMode: false,
  activeMonitoringModule: 'cokewatch',
  isReportFormOpen: false,

  setCurrentTab: (tab) => set({ currentTab: tab }),
  setTimeRange: (range) => set({ timeRange: range }),
  setPollutionData: (data) => set({ pollutionData: data }),
  setViolations: (violations) => set({ violations }),
  setCommunityReports: (reports) => set({ communityReports: reports }),
  setWaterQualityData: (data) => set({ waterQualityData: data }),
  setFacilities: (facilities) => set({ facilities }),
  setUserStats: (stats) => set({ userStats: stats }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setActiveUnit: (unit) => set({ activeUnit: unit }),
  setCurriculumMappings: (mappings) => set({ curriculumMappings: mappings }),
  setHighlightedMetric: (metric) => set({ highlightedMetric: metric }),
  setIsAdminMode: (isAdmin) => set({ isAdminMode: isAdmin }),
  setActiveMonitoringModule: (module) => set({ activeMonitoringModule: module }),
  setIsReportFormOpen: (isOpen) => set({ isReportFormOpen: isOpen }),
}));
