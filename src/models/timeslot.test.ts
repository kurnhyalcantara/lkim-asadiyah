import data from '../../docs/default-firebase-data.json';
import { Timeslot } from './timeslot';
import { allKeys } from './utils';

describe('timeslot', () => {
  it('matches the shape of the default data', () => {
    const days: Timeslot[] = data['schedule']['1']['timeslots'];
    const keys: Array<keyof Timeslot> = ['sessions'];
    expect(days).toHaveLength(1);
    expect(allKeys(days)).toStrictEqual(keys);
  });
});
