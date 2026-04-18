import { z } from 'zod';

export const RiskScoreSchema = z.object({
  riskScore: z.number().min(1).max(10),
  riskCategory: z.enum(['low', 'medium', 'high']),
  riskFactors: z.array(z.object({
    category: z.string(),
    score: z.number().min(1).max(10),
    explanation: z.string()
  })),
  positiveFactors: z.array(z.string()),
  mitigants: z.array(z.string())
});

export const ROIPredictionSchema = z.object({
  annualYieldPrediction: z.number().min(0).max(1),
  confidenceScore: z.number().min(0).max(1),
  confidenceReason: z.string(),
  yieldRange: z.object({ low: z.number(), high: z.number() }),
  timeToFirstYield: z.string(),
  yieldDrivers: z.array(z.string())
});

export const ReasoningSchema = z.object({
  reasoning: z.string().max(500),
  whyInvest: z.array(z.string()).length(3),
  warnings: z.array(z.string()).max(2),
  oneLineSummary: z.string().max(100)
});

export const TrustLayerSchema = z.object({
  explanation: z.string(),
  dataSources: z.array(z.object({
    source: z.string(),
    description: z.string(),
    reliability: z.enum(['high', 'medium', 'low'])
  })),
  methodology: z.string(),
  limitations: z.string(),
  lastUpdated: z.string()
});

export const DeepDiveSchema = z.object({
  executiveSummary: z.string(),
  riskBreakdown: z.array(z.object({
    category: z.string(),
    score: z.number().min(1).max(10),
    explanation: z.string(),
    mitigants: z.array(z.string())
  })),
  yieldAnalysis: z.string(),
  regionalContext: z.string(),
  marketPosition: z.string(),
  investmentTimeline: z.string(),
  keyQuestions: z.array(z.string())
});

export const InvestorFitSchema = z.object({
  fitScore: z.number().min(0).max(10),
  fitReason: z.string(),
  fitCategory: z.enum(['excellent', 'good', 'fair', 'poor']),
  personalisation: z.object({
    alignsWithGoal: z.boolean(),
    withinRiskTolerance: z.boolean(),
    meetsYieldExpectation: z.boolean(),
    matchesPreferredRegion: z.boolean()
  }),
  recommendation: z.enum(['strong buy', 'consider', 'caution', 'not recommended'])
});

export async function validateWithRetry<T>(
  schema: z.ZodSchema<T>,
  generateFn: () => Promise<string>,
  maxRetries: number = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const raw = await generateFn();
      const cleaned = raw.replace(/```json|```/g, '').trim();
      return schema.parse(JSON.parse(cleaned));
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  throw new Error('Validation failed after max retries');
}
