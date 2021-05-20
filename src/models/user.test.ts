import { UserData } from './user';
import { allKeys } from './utils';

describe('pengurus', () => {
  it('matches the shape of the default data', () => {
    const user: UserData[] = [
      {
        alamat_sekarang: 'Lajokka',
        email: 'kurnhyalcantara@gmail.com',
        fakultas: 'Tarbiyah',
        instagram_id: '@kurnhyalcantara',
        jenis_kelamin: 'Pria',
        jurusan: 'Pendidikan',
        no_whatsapp: '123',
        semester: '7',
        tanggal_lahir: '12',
        tempat_lahir: 'lapao'
      },
    ];
    const keys: Array<keyof UserData> = [
      'alamat_sekarang',
      'email',
      'fakultas',
      'instagram_id',
      'jenis_kelamin',
      'jurusan',
      'no_whatsapp',
      'semester',
      'tanggal_lahir',
      'tempat_lahir',
    ];
    expect(user).toHaveLength(1);
    expect(allKeys(user)).toStrictEqual(keys);
  });
});
