import data from '../../docs/default-firebase-data.json';
import { PengurusData } from './pengurus';
import { allKeys } from './utils';

describe('pengurus', () => {
  it('matches the shape of the default data', () => {
    const pengurus: PengurusData[] = Object.values(data['pengurus']);
    const keys: Array<keyof PengurusData> = [
      'bio',
      'featured',
      'jabatan',
      'name',
      'order',
      'photoUrl',
      'pronouns',
      'shortBio',
      'socials',
      'title',
    ];
    expect(pengurus).toHaveLength(21);
    expect(allKeys(pengurus)).toStrictEqual(keys);
  });
});
