import { Timeslot } from './timeslot';
export interface Day {
  date: string;
  month: string;
  timeslots: Timeslot[];
}
