import bcrypt from 'bcrypt';

export default class BcryptService {
  generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  compareHash(passwordBody: string, passwordDB: string): boolean {
    return bcrypt.compareSync(passwordBody, passwordDB);
  }
}
