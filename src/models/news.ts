import { Id } from './types';

export interface NewsData {
  backgroundColor: string;
  brief: string;
  content: string;
  image: string;
  published: string;
  source?: string;
  title: string;
}

export type News = NewsData & Id;
