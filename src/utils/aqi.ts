import type { AQIInfo, AQILevel } from '../types';

export function calculateAQI(pollutant: number, pollutantType: 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co' | 'benzene'): number {
  const breakpoints: Record<string, Array<[number, number, number, number]>> = {
    pm25: [
      [0, 12, 0, 50],
      [12.1, 35.4, 51, 100],
      [35.5, 55.4, 101, 150],
      [55.5, 150.4, 151, 200],
      [150.5, 250.4, 201, 300],
      [250.5, 500, 301, 500],
    ],
    pm10: [
      [0, 54, 0, 50],
      [55, 154, 51, 100],
      [155, 254, 101, 150],
      [255, 354, 151, 200],
      [355, 424, 201, 300],
      [425, 604, 301, 500],
    ],
    o3: [
      [0, 54, 0, 50],
      [55, 70, 51, 100],
      [71, 85, 101, 150],
      [86, 105, 151, 200],
      [106, 200, 201, 300],
    ],
    benzene: [
      [0, 5, 0, 50],
      [5.1, 10, 51, 100],
      [10.1, 20, 101, 150],
      [20.1, 40, 151, 200],
      [40.1, 80, 201, 300],
      [80.1, 200, 301, 500],
    ],
  };

  const bps = breakpoints[pollutantType] || breakpoints.pm25;

  for (const [cLow, cHigh, iLow, iHigh] of bps) {
    if (pollutant >= cLow && pollutant <= cHigh) {
      return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (pollutant - cLow) + iLow);
    }
  }

  return 500;
}

export function getAQILevel(aqi: number): AQILevel {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy_sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very_unhealthy';
  return 'hazardous';
}

export function getAQIInfo(aqi: number): AQIInfo {
  const level = getAQILevel(aqi);

  const info: Record<AQILevel, Omit<AQIInfo, 'value' | 'level'>> = {
    good: {
      color: '#22c55e',
      description: 'Good',
      healthImplications: 'Air quality is satisfactory, and air pollution poses little or no risk.',
      cautionaryStatement: 'None',
    },
    moderate: {
      color: '#fbbf24',
      description: 'Moderate',
      healthImplications: 'Air quality is acceptable. However, there may be a risk for some people.',
      cautionaryStatement: 'Unusually sensitive people should consider limiting prolonged outdoor exertion.',
    },
    unhealthy_sensitive: {
      color: '#f97316',
      description: 'Unhealthy for Sensitive Groups',
      healthImplications: 'Members of sensitive groups may experience health effects.',
      cautionaryStatement: 'Active children and adults, and people with respiratory disease should limit prolonged outdoor exertion.',
    },
    unhealthy: {
      color: '#ef4444',
      description: 'Unhealthy',
      healthImplications: 'Some members of the general public may experience health effects.',
      cautionaryStatement: 'Active children and adults, and people with respiratory disease should avoid prolonged outdoor exertion.',
    },
    very_unhealthy: {
      color: '#a855f7',
      description: 'Very Unhealthy',
      healthImplications: 'Health alert: The risk of health effects is increased for everyone.',
      cautionaryStatement: 'Everyone should avoid prolonged outdoor exertion.',
    },
    hazardous: {
      color: '#7f1d1d',
      description: 'Hazardous',
      healthImplications: 'Health warning of emergency conditions: everyone is more likely to be affected.',
      cautionaryStatement: 'Everyone should avoid all outdoor exertion.',
    },
  };

  return {
    value: aqi,
    level,
    ...info[level],
  };
}
