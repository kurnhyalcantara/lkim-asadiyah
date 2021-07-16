import data from '../../docs/default-firebase-data.json';
import { Timeslot } from './timeslot';
import { allKeys } from './utils';

describe('timeslot', () => {
  it('matches the shape of the default data', () => {
    const days: Timeslot[] = data['schedule']['3']['timeslots'];
    const keys: Array<keyof Timeslot> = ['dateMonth', 'dateReadable', 'sessions'];
    expect(days).toHaveLength(1);
    expect(allKeys(days)).toStrictEqual(keys);
  });
});
