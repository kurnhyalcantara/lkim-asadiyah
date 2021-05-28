import data from '../../docs/default-firebase-data.json';
import { SessionData } from './session';
import { allKeys } from './utils';

describe('session', () => {
  it('matches the shape of the default data', () => {
    const sessions: SessionData[] = Object.values(data['sessions']);
    const keys: Array<keyof SessionData> = [
      'address',
      'city',
      'description',
      'featured',
      'partisipants',
      'poster',
      'registration',
      'tags',
      'tanggal',
      'time',
      'title',
      'until',
    ];
    expect(sessions).toHaveLength(2);
    expect(allKeys(sessions)).toStrictEqual(keys);
  });
});
