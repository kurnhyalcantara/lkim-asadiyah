import { Id } from './types';

export interface NewsData {
  author: string;
  avatar: string;
  backgroundColor: string;
  brief: string;
  content: string;
  image: string;
  published: string;
  title: string;
}

export type News = NewsData & Id;
