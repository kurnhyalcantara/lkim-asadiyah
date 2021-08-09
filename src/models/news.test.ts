import data from '../../docs/default-firebase-data.json';
import { NewsData } from './news';
import { allKeys } from './utils';

describe('post', () => {
  it('matches the shape of the default data', () => {
    const posts: NewsData[] = Object.values(data['news']);
    const keys: Array<keyof NewsData> = [
      'author',
      'avatar',
      'backgroundColor',
      'brief',
      'content',
      'image',
      'published',
      'title',
    ];
    expect(posts).toHaveLength(1);
    expect(allKeys(posts)).toStrictEqual(keys);
  });
});
