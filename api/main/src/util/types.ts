export const Granularities = ['day', 'month', 'year'] as const;
export type Granularity = typeof Granularities[number];
export function isGranularity(x: any): x is Granularity {
  return Granularities.includes(x) || x === undefined;
}

export const granularityErrorMessage = `Invalid net worth granularity. Must be one of [${Granularities.join(
  ', ',
)}]`;

export interface BasicError {
  code: number;
  message: string;
}
