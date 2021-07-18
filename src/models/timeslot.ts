import { Time } from './time';

export interface Timeslot {
  dateMonth: string;
  dateReadable: string;
  sessions: Time[];
}
