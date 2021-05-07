import data from '../../docs/default-firebase-data.json';
import { Day } from './day';
import { allKeys } from './utils';

describe('day', () => {
  it('matches the shape of the default data', () => {
    const days: Day[] = Object.values(data['schedule']);
    const keys: Array<keyof Day> = ['month', 'timeslots'];
    expect(days).toHaveLength(2);
    expect(allKeys(days)).toStrictEqual(keys);
  });
});
