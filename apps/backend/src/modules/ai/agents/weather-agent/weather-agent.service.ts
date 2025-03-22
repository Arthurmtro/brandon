import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { DynamicStructuredTool } from 'langchain/tools';

@Injectable()
export class WeatherAgentService {
  getWeather = new DynamicStructuredTool({
    name: 'get_weather',
    description: 'Call to get the current weather.',
    schema: z.object({
      location: z.string().describe('Location to get the weather for.'),
    }),
    func: async ({ location }) => {
      const lower = location.toLowerCase();
      if (['sf', 'san francisco'].includes(lower)) {
        return "It's 60 degrees and foggy.";
      } else {
        return "It's 90 degrees and sunny.";
      }
    },
  });

  getCoolestCities = new DynamicStructuredTool({
    name: 'get_coolest_cities',
    description: 'Get a list of coolest cities',
    schema: z.object({
      noOp: z.string().optional().describe('No-op parameter.'),
    }),
    func: async () => {
      return 'nyc, sf';
    },
  });
}
