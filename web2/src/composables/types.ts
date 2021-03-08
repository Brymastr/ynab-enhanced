export interface WorthDate {
  date: string;
  worth: number;
  previous?: WorthDate;
  index?: number;
}
