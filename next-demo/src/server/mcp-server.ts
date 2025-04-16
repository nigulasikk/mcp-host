import { FastMCP } from "fastmcp";
import { z } from "zod";

export interface WeatherData {
  location: string;
  temperature: number;
  units: 'metric' | 'imperial';
  condition: string;
  humidity: number;
  windSpeed?: number;
}

export const createMcpServer = () => {
  const server = new FastMCP({
    name: "MCP Demo Server",
    version: "1.0.0",
  });

  server.addTool({
    name: "getWeather",
    description: "获取指定位置的天气信息",
    parameters: z.object({
      location: z.string().describe("城市或位置名称"),
      units: z.enum(["metric", "imperial"]).default("metric").describe("温度单位 (metric: 摄氏度, imperial: 华氏度)")
    }),
    execute: async (args) => {
      const weather = await getWeatherData(args.location, args.units);
      
      return {
        content: [
          { 
            type: "text", 
            text: `${args.location} 的天气情况:\n温度: ${weather.temperature}°${args.units === 'metric' ? 'C' : 'F'}\n天气状况: ${weather.condition}\n湿度: ${weather.humidity}%\n风速: ${weather.windSpeed}km/h` 
          }
        ]
      };
    },
  });

  return server;
};

export async function getWeatherData(location: string, units: 'metric' | 'imperial' = 'metric'): Promise<WeatherData> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockConditions = ['晴朗', '多云', '阴天', '小雨', '雷雨', '小雪', '雾'];
  const condition = mockConditions[Math.floor(Math.random() * mockConditions.length)];
  
  let baseTemp = 22;
  switch (condition) {
    case '晴朗': baseTemp = 28; break;
    case '多云': baseTemp = 22; break;
    case '阴天': baseTemp = 18; break;
    case '小雨': baseTemp = 15; break;
    case '雷雨': baseTemp = 12; break;
    case '小雪': baseTemp = -2; break;
    case '雾': baseTemp = 10; break;
  }
  
  const tempVariation = Math.floor(Math.random() * 6) - 3;
  let temperature = baseTemp + tempVariation;
  
  if (units === 'imperial') {
    temperature = Math.round((temperature * 9/5) + 32);
  }
  
  let humidity = 45 + Math.floor(Math.random() * 30);
  let windSpeed = 5 + Math.floor(Math.random() * 15);
  
  return {
    location,
    temperature,
    units,
    condition,
    humidity,
    windSpeed
  };
}
