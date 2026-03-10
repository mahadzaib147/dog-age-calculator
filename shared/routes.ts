import { z } from 'zod';
import { CalculateRequestSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  breeds: {
    list: {
      method: 'GET' as const,
      path: '/api/breeds',
      responses: {
        200: z.array(z.string()),
      },
    },
  },
  calculate: {
    method: 'POST' as const,
    path: '/api/calculate',
    input: CalculateRequestSchema,
    responses: {
      200: z.object({
        humanAge: z.number(),
        lifeStage: z.object({
          label: z.string(),
          badgeColor: z.string(),
          message: z.string(),
        }),
        primeStage: z.object({
          label: z.string(),
          description: z.string(),
        }),
        energyLevel: z.object({
          level: z.enum(["High", "Moderate", "Low"]),
          description: z.string(),
        }),
        activityNeeds: z.object({
          capacity: z.string(),
          description: z.string(),
        }),
        ageProgress: z.number(),
      }),
      400: errorSchemas.validation,
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
