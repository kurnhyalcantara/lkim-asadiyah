import data from '../../docs/default-firebase-data.json';
import { NewsData } from './news';
import { allKeys } from './utils';

describe('post', () => {
  it('matches the shape of the default data', () => {
    const posts: NewsData[] = Object.values(data['blog']);
    const keys: Array<keyof NewsData> = [
      'backgroundColor',
      'brief',
      'content',
      'image',
      'published',
      'source',
      'title',
    ];
    expect(posts).toHaveLength(5);
    expect(allKeys(posts)).toStrictEqual(keys);
  });
});
