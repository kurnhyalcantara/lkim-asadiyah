import data from '../../docs/default-firebase-data.json';
import { Time } from './time';
import { allKeys } from './utils';

describe('time', () => {
  it('matches the shape of the default data', () => {
    const times: Time[] = data['schedule']['1']['timeslots'][1]['sessions'];
    const keys: Array<keyof Time> = ['items'];
    expect(times).toHaveLength(9);
    expect(allKeys(times)).toStrictEqual(keys);
  });
});
