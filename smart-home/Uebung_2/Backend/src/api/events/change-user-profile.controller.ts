import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpPut, interfaces } from 'inversify-express-utils';
import { DatabaseService } from '../../core/services/database.service';
import { AdminAccountsService } from '../../core/services/admin-accounts.service';
import { ChangeAdminPasswordData } from '../../models/change-admin-password-data.model';
import { ChangeAdminUsernameData } from '../../models/change-admin-username-data.model';
import { PasswordHashingService } from '../../core/services/password-hashing.service';
import { UserAccountsService } from '../../core/services/user-accounts.service';
import { ChangeUserPasswordData } from '../../models/change-user-password-data.model';
import { ChangeUserUsernameData } from '../../models/change-user-username-data.model';

@controller('/user-edit')
@injectable()
export class ChangeUserProfileController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService,
    @inject(UserAccountsService.name)
    private userAccountsService: AdminAccountsService,
    @inject(PasswordHashingService.name)
    private passWordHashingService: PasswordHashingService
  ) {}

  @httpPut('/password/:id')
  public async updateUserPassword(request: Request, response: Response): Promise<void> {
    try {
      let passwordErrorMessage = 'The password has to contain at least one uppercase letter, one lowercase letter, one special character and one number (at least 8 characters)!';

      if (request.body.userId == undefined || request.body.userId == null) {
        return response.status(400).json({
          error: 'The ID of the user was not defined!'
        });
      }

      if (request.params.id == undefined || request.params.id == null) {
        return response.status(400).json({
          error: 'The ID of the user was not defined!'
        });
      }

      if (request.body.userId != request.params.id) {
        return response.status(400).json({
          error: 'The ID of the user in the parameters does not match the ID in the request!'
        });
      }

      var userAccounts = await this.databaseService.getUserAccountsByID(request.body.userId);

      if (userAccounts.length != 1) {
        return response.status(400).json({
          error: 'No user with the ID in the request could be identified!'
        });
      }

      if (!this.userAccountsService.isPasswordValid(request.body.oldPassword)) {
        return response.status(400).json({ error: passwordErrorMessage });
      }

      if (!this.passWordHashingService.isPasswordHashed(request.body.oldPassword, userAccounts[0].passWord)) {
        return response.status(400).json({
          error: `The old password \"${request.body.oldPassword}\" and the \"${userAccounts[0].passWord}\" password found in the database do not match!`
        });
      }

      if (!this.userAccountsService.isPasswordValid(request.body.newPassword)) {
        return response.status(400).json({ error: passwordErrorMessage });
      }

      var newPasswordHash = this.passWordHashingService.hash(request.body.newPassword);

      var passwordData = {
        userId: request.body.userId,
        oldPassword: userAccounts[0].passWord,
        newPassword: newPasswordHash
      } as ChangeUserPasswordData;
      var updatedPasswordData = await this.databaseService.updateUserPassword(passwordData);
      updatedPasswordData.oldPassword = request.body.oldPassword;
      updatedPasswordData.newPassword = request.body.newPassword;
      return response.status(201).json(updatedPasswordData);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }

  @httpPut('/username/:id')
  public async updateUserUsername(request: Request, response: Response): Promise<void> {
    try {
      let userNameErrorMessage = 'The username has to contain at least 3 characters!';

      if (request.body.userId == undefined || request.body.userId == null) {
        return response.status(400).json({
          error: 'The ID of the user was not defined!'
        });
      }

      if (request.params.id == undefined || request.params.id == null) {
        return response.status(400).json({
          error: 'The ID of the user was not defined!'
        });
      }

      if (request.body.userId != request.params.id) {
        return response.status(400).json({
          error: 'The ID of the user in the parameters does not match the ID in the request!'
        });
      }

      var userAccounts = await this.databaseService.getUserAccountsByID(request.body.userId);

      if (userAccounts.length != 1) {
        return response.status(400).json({
          error: 'No user with the ID in the request could be identified!'
        });
      }

      if (!this.userAccountsService.isUserNameValid(request.body.oldUsername)) {
        return response.status(400).json({ error: userNameErrorMessage });
      }

      if (userAccounts[0].userName != request.body.oldUsername) {
        return response.status(400).json({
          error: `The old username \"${request.body.oldUsername}\" and the username \"${userAccounts[0].userName}\" found in the database do not match!`
        });
      }

      if (!this.userAccountsService.isUserNameValid(request.body.newUsername)) {
        return response.status(400).json({ error: userNameErrorMessage });
      }

      var allUserAccounts = await this.databaseService.getUserAccounts();

      if (this.userAccountsService.containsUser(allUserAccounts, request.body.newUsername)) {
        return response.status(401).json({ error: `The given user name \"${request.body.newUsername}\" already exists!`});
      }

      var usernameData = {
        userId: request.body.userId,
        oldUsername: request.body.oldUsername,
        newUsername: request.body.newUsername
      } as ChangeUserUsernameData;
      var updatedUsernameData = await this.databaseService.updateUserUsername(usernameData);
      return response.status(201).json(updatedUsernameData);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
