import { Social } from './social';
import { Id } from './types';

export interface PengurusData {
  bio: string;
  featured: boolean;
  jabatan: string;
  name: string;
  order: number;
  photoUrl: string;
  pronouns?: string;
  shortBio: string;
  socials: Social[];
  title: string;
}

export type Pengurus = Id & PengurusData;
