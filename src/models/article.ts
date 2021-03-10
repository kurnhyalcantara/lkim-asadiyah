import { Id } from './types';

export interface ArticleData {
  backgroundColor: string;
  brief: string;
  content: string;
  image: string;
  published: string;
  source?: string;
  title: string;
}

export type Article = ArticleData & Id;
