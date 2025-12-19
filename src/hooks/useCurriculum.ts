import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store';
import type { CurriculumMapping } from '../types';

export function useCurriculum() {
  const setCurriculumMappings = useAppStore((state) => state.setCurriculumMappings);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const setError = useAppStore((state) => state.setError);

  useEffect(() => {
    async function fetchCurriculumMappings() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('curriculum_mapping')
          .select('*')
          .eq('is_active', true)
          .order('unit_code');

        if (error) throw error;

        setCurriculumMappings(data as CurriculumMapping[]);
      } catch (error) {
        console.error('Error fetching curriculum mappings:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch curriculum data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurriculumMappings();
  }, [setCurriculumMappings, setIsLoading, setError]);
}

export function useEducationalContent(targetMetric: string) {
  const activeUnit = useAppStore((state) => state.activeUnit);
  const curriculumMappings = useAppStore((state) => state.curriculumMappings);

  if (!activeUnit) return null;

  return curriculumMappings.find(
    (mapping) => mapping.target_metric === targetMetric && mapping.unit_code === activeUnit
  );
}
