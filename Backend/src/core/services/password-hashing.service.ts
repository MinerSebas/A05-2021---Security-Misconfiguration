import { injectable } from 'inversify';

@injectable()
export class PasswordHashingService {

  public hash(passWord: string): string {
    var passwordHash = require('password-hash');
    return passwordHash.generate(passWord);
  }

  public isPasswordHashed(plainTextPassword: string, hashedPassword: string): boolean {
    var passWordHash = require('password-hash');
    return passWordHash.verify(plainTextPassword, hashedPassword);
  }
}
