import data from '../../docs/default-firebase-data.json';
import { ArticleData } from './articles';
import { allKeys } from './utils';

describe('post', () => {
  it('matches the shape of the default data', () => {
    const posts: ArticleData[] = Object.values(data['articles']);
    const keys: Array<keyof ArticleData> = [
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
