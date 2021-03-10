import { Social } from './social';
import { Id } from './types';

export interface PengurusData {
  bio: string;
  jabatan: string;
  featured: boolean;
  name: string;
  order: number;
  photoUrl: string;
  pronouns?: string;
  shortBio: string;
  socials: Social[];
  title: string;
}

export type Pengurus = Id & PengurusData;
