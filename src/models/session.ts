import { Id } from './types';

export interface SessionData {
  address: string;
  city: string;
  description: string;
  featured?: boolean;
  partisipants: string;
  poster: string;
  registration?: string;
  tags: string[];
  tanggal?: string;
  time?: string;
  title: string;
  until?: string;
}

export type Session = Id & SessionData;
