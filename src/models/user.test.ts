import { UserData } from './user';
import { allKeys } from './utils';

describe('pengurus', () => {
  it('matches the shape of the default data', () => {
    const user: UserData[] = [
      {
        alamatSekarang: 'Lajokka',
        email: 'kurnhyalcantara@gmail.com',
        fakultas: 'Tarbiyah',
        instagram: '@kurnhyalcantara',
        jenisKelamin: 'Pria',
        jurusan: 'Pendidikan',
        semester: '7',
        tanggalLahir: '12',
        tempatLahir: 'lapao',
        whatsapp: '123',
      },
    ];
    const keys: Array<keyof UserData> = [
      'alamatSekarang',
      'email',
      'fakultas',
      'instagram',
      'jenisKelamin',
      'jurusan',
      'semester',
      'tanggalLahir',
      'tempatLahir',
      'whatsapp',
    ];
    expect(user).toHaveLength(1);
    expect(allKeys(user)).toStrictEqual(keys);
  });
});
