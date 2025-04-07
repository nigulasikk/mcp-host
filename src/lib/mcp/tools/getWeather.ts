import axios from 'axios';
import { McpTool } from '../types';

export interface WeatherData {
  location: string;
  temperature: number;
  units: 'metric' | 'imperial';
  condition: string;
  humidity: number;
  windSpeed?: number;
}

export const getWeatherTool: McpTool = {
  name: 'getWeather',
  description: 'Get weather information for a location',
  parameters: {
    type: 'object',
    properties: {
      location: { 
        type: 'string', 
        description: 'City or location name' 
      },
      units: { 
        type: 'string', 
        enum: ['metric', 'imperial'], 
        default: 'metric',
        description: 'Units for temperature (metric: Celsius, imperial: Fahrenheit)'
      }
    },
    required: ['location']
  },
  handler: async (params) => {
    return { status: 'pending' };
  }
};

export async function getWeatherData(location: string, units: 'metric' | 'imperial' = 'metric'): Promise<WeatherData> {
  try {
    
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockConditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Stormy', 'Snowy', 'Foggy'];
    const condition = mockConditions[Math.floor(Math.random() * mockConditions.length)];
    
    let baseTemp = 22;
    switch (condition) {
      case 'Sunny': baseTemp = 28; break;
      case 'Cloudy': baseTemp = 18; break;
      case 'Partly Cloudy': baseTemp = 22; break;
      case 'Rainy': baseTemp = 15; break;
      case 'Stormy': baseTemp = 12; break;
      case 'Snowy': baseTemp = -2; break;
      case 'Foggy': baseTemp = 10; break;
    }
    
    const tempVariation = Math.floor(Math.random() * 6) - 3;
    let temperature = baseTemp + tempVariation;
    
    if (units === 'imperial') {
      temperature = Math.round((temperature * 9/5) + 32);
    }
    
    let humidity = 45;
    switch (condition) {
      case 'Sunny': humidity = 30 + Math.floor(Math.random() * 20); break;
      case 'Cloudy': humidity = 60 + Math.floor(Math.random() * 20); break;
      case 'Partly Cloudy': humidity = 45 + Math.floor(Math.random() * 15); break;
      case 'Rainy': humidity = 80 + Math.floor(Math.random() * 15); break;
      case 'Stormy': humidity = 85 + Math.floor(Math.random() * 10); break;
      case 'Snowy': humidity = 70 + Math.floor(Math.random() * 20); break;
      case 'Foggy': humidity = 90 + Math.floor(Math.random() * 10); break;
    }
    
    let windSpeed = 5;
    switch (condition) {
      case 'Sunny': windSpeed = 2 + Math.floor(Math.random() * 5); break;
      case 'Cloudy': windSpeed = 5 + Math.floor(Math.random() * 7); break;
      case 'Partly Cloudy': windSpeed = 3 + Math.floor(Math.random() * 6); break;
      case 'Rainy': windSpeed = 8 + Math.floor(Math.random() * 10); break;
      case 'Stormy': windSpeed = 15 + Math.floor(Math.random() * 20); break;
      case 'Snowy': windSpeed = 6 + Math.floor(Math.random() * 8); break;
      case 'Foggy': windSpeed = 1 + Math.floor(Math.random() * 3); break;
    }
    
    return {
      location,
      temperature,
      units,
      condition,
      humidity,
      windSpeed
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error(`Failed to get weather data for ${location}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
