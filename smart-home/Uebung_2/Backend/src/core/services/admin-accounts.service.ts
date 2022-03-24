import { injectable } from 'inversify';
import { AdminAccount } from '../../models/admin-account.model';

/**
 * The operations associated with the admin accounts.
 */
@injectable()
export class AdminAccountsService {

  public contains(accounts: Array<AdminAccount>, userName: string, passWord: string): boolean {
    if (accounts == undefined || accounts == null || accounts.length == 0) {
      return false;
    }

    return accounts.some((a) => a.userName == userName && a.passWord == passWord);
  }

  public containsUser(accounts: Array<AdminAccount>, userName: string): boolean {
    if (accounts == undefined || accounts == null || accounts.length == 0) {
      return false;
    }

    return accounts.some((a) => a.userName == userName);
  }

  public containsUserId(accounts: Array<AdminAccount>, id: string): boolean {
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
