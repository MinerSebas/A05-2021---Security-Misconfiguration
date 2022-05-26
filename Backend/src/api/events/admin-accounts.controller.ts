import { inject, injectable } from 'inversify';
import { controller, httpGet, httpPost, interfaces, queryParam, request } from 'inversify-express-utils';
import { DatabaseService } from '../../core/services/database.service';
import { AdminAccount } from '../../models/admin-account.model';
import { Request, Response } from 'express';
import { AdminAccountsService } from '../../core/services/admin-accounts.service';
import { PasswordHashingService } from '../../core/services/password-hashing.service';
import { IdGeneratorService } from '../../core/services/id-generator.service';
import { Sensor } from '../../models/sensor.model';
import { SensorsService } from '../../core/services/sensors.service';
import { ActorsService } from '../../core/services/actors.service';
import { Actor } from '../../models/actor.model';
import * as backendConfiguration from '../../configuration/backend-config.json';

@controller('/admin')
@injectable()
export class AdminAccountsController implements interfaces.Controller {

  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService,
    @inject(AdminAccountsService.name)
    private adminAccountsService: AdminAccountsService,
    @inject(PasswordHashingService.name)
    private passWordHashingService: PasswordHashingService,
    @inject (IdGeneratorService.name)
    private idGeneratorService: IdGeneratorService,
    @inject (SensorsService.name)
    private sensorsService: SensorsService,
    @inject (ActorsService.name)
    private actorsService : ActorsService
  ) {}

  @httpGet('/')
  public async getAdminAccounts(request: Request, response: Response): Promise<void> {
    this.databaseService.getAdminAccounts().then((result: Array<AdminAccount>) => {
      return response.json(result);
    });
  }

  @httpGet('/lookup')
  public async getAdminAccount(@queryParam('userName') userName: string, @queryParam('passWord') passWord: string, request: Request, response: Response): Promise<void> {
    try {
      if (userName == 'undefined' || userName == null) {
        return response.status(400).json({ error: 'The user name was not defined!' });
      }
      if (passWord == 'undefined' || passWord == null) {
        return response.status(400).json({ error: 'The password was not defined!' });
      }

      this.databaseService.getAdminAccountByUserName(userName).then((result: Array<AdminAccount>) => {
        if (result.length == 0 || result.length != 1) {
          return response.status(400).json({
            error: `No user with the given username \"${userName}\" could be found!`
          });
        }

        var passwordHash = this.passWordHashingService.hash(passWord);

        if (!this.passWordHashingService.isPasswordHashed(passWord, result[0].passWord)) {
          if (backendConfiguration.debug) {
            return response.status(400).json({
              error: `The password is incorrect!`
            });
          } else {
            return response.status(400).json({
              error: `The password is incorrect.`
            });
          }
        }

        result[0].passWord = passWord;
        return response.status(200).json(result);
      });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }

  @httpPost('/newaccount')
  public async createAdminAccount(request: Request, response: Response): Promise<void> {
    let passwordErrorMessage = 'The password has to contain at least one uppercase letter, one lowercase letter, one special character and one number (at least 8 characters)!';
    let userNameErrorMessage = 'The username has to contain at least 3 characters!';
    try {
      if (!this.adminAccountsService.isUserNameValid(request.body.userName)) {
        return response.status(400).json({ error: userNameErrorMessage });
      }

      if (!this.adminAccountsService.isPasswordValid(request.body.passWord)) {
        return response.status(400).json({ error: passwordErrorMessage });
      }

      var adminEntries = await this.databaseService.getAdminAccountByUserName(request.body.userName);

      if (this.adminAccountsService.containsUser(adminEntries, request.body.userName)) {
        return response.status(401).json({ error: `The given user name \"${request.body.userName}\" already exists!` });
      }


      var passWordHashed = this.passWordHashingService.hash(request.body.passWord);

      var id = this.idGeneratorService.generateAdminId();

      while (this.adminAccountsService.containsUserId(adminEntries, id)) {
        id = this.idGeneratorService.generateAdminId();
      }

      let adminAccount = {
        personId : id,
        userName: request.body.userName,
        passWord: passWordHashed
      } as AdminAccount;

      let insertedAccount = await this.databaseService.insertAdminAccount(adminAccount);
      console.log(insertedAccount);
      insertedAccount.passWord = request.body.passWord;
      var sensor1 = this.sensorsService.getDefaultSensor(id);
      var sensor2 = this.sensorsService.getDefaultSensor(id);
      var sensor3 = this.sensorsService.getDefaultSensor(id);
      var sensor1Inserted = await this.databaseService.insertSensor(sensor1);
      var sensor2Inserted = await this.databaseService.insertSensor(sensor2);
      var sensor3Inserted = await this.databaseService.insertSensor(sensor3);
      var actor1 = this.actorsService.getDefaultActor(id);
      var actor2 = this.actorsService.getDefaultActor(id);
      var actor3 = this.actorsService.getDefaultActor(id);
      var actor1Inserted = await this.databaseService.insertActor(actor1);
      var actor2Inserted = await this.databaseService.insertActor(actor2);
      var actor3Inserted = await this.databaseService.insertActor(actor3);
      return response.status(201).json(insertedAccount);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
