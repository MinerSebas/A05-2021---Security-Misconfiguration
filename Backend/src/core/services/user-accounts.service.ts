import { injectable } from 'inversify';
import { UserAccount } from '../../models/user-account.model';

@injectable()
export class UserAccountsService {

  public contains(accounts: Array<UserAccount>, userName: string, passWord: string): boolean {
    if (accounts == undefined || accounts == null || accounts.length == 0) {
      return false;
    }

    return accounts.some((a) => a.userName == userName && a.passWord == passWord);
  }

  public containsUser(accounts: Array<UserAccount>, userName: string): boolean {
    if (accounts == undefined || accounts == null || accounts.length == 0) {
      return false;
    }

    return accounts.some((a) => a.userName == userName);
  }

  public containsUserId(accounts: Array<UserAccount>, id: string): boolean {
    if (accounts == undefined || accounts == null || accounts.length == 0) {
      return false;
    }

    return accounts.some((a) => a.personId == id);
  }

  public isPasswordValid(passWord: string): boolean {
    if (passWord == undefined || passWord == null) {
      return false;
    }

    if (!(passWord.length >= 8)) {
      return false;
    }

    let regexABC = new RegExp('[A-Z]+');

    if (!regexABC.test(passWord)) {
      return false;
    }

    let regexabc = new RegExp('[a-z]+');

    if (!regexabc.test(passWord)) {
      return false;
    }

    let regex123 = new RegExp('[0-9]+');

    if (!regex123.test(passWord)) {
      return false;
    }

    let regexSpecial = new RegExp('[^A-Za-z0-9]+');

    if (!regexSpecial.test(passWord)) {
      return false;
    }

    return true;
  }

  public isUserNameValid(userName: string): boolean {
    if (userName == undefined || userName == null) {
      return false;
    }

    if (!(userName.length >= 3)) {
      return false;
    }

    return true;
  }
}
