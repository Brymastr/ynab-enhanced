export interface WorthDate {
  date: string;
  worth: number;
  previous?: WorthDate;
  index?: number;
}

export type LoadingStatus = 'loading' | 'complete' | 'ready';
