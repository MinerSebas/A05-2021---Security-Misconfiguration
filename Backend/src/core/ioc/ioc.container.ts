import { Container } from 'inversify';
import { LoggerService } from '../services/logger.service';
import 'reflect-metadata';
import { interfaces, TYPE } from 'inversify-express-utils';
import { DatabaseService } from '../services/database.service';
import { AdminAccountsController } from '../../api/events/admin-accounts.controller';
import { AdminAccountsService } from '../services/admin-accounts.service';
import { IdGeneratorService } from '../services/id-generator.service';
import { PasswordHashingService } from '../services/password-hashing.service';
import { UserAccountsController } from '../../api/events/user-accounts.controller';
import { ChangeUserProfileController } from '../../api/events/change-user-profile.controller';
import { Sensor } from '../../models/sensor.model';
import { SensorsService } from '../services/sensors.service';
import { Actor } from '../../models/actor.model';
import { ActorsService } from '../services/actors.service';
import { SensorsController } from '../../api/events/sensors.controller';
import { UserAccountsService } from '../services/user-accounts.service';
import { ActorsController } from '../../api/events/actors.controller';

export class IoContainer {
  private container = new Container();

  public init(): void {
    this.initServices();
    this.initController();
  }

  public getContainer(): Container {
    return this.container;
  }

  private initController(): void {
    this.container.bind<interfaces.Controller>(TYPE.Controller).to(AdminAccountsController).whenTargetNamed(AdminAccountsController.name);
    this.container.bind<interfaces.Controller>(TYPE.Controller).to(UserAccountsController).whenTargetNamed(UserAccountsController.name);
    this.container.bind<interfaces.Controller>(TYPE.Controller).to(ChangeUserProfileController).whenTargetNamed(ChangeUserProfileController.name);
    this.container.bind<interfaces.Controller>(TYPE.Controller).to(SensorsController).whenTargetNamed(SensorsController.name);
    this.container.bind<interfaces.Controller>(TYPE.Controller).to(ActorsController).whenTargetNamed(ActorsController.name);
  }

  private initServices(): void {
    this.container.bind<LoggerService>(LoggerService.name).to(LoggerService).inSingletonScope();
    this.container.bind<DatabaseService>(DatabaseService.name).to(DatabaseService).inSingletonScope();
    this.container.bind<AdminAccountsService>(AdminAccountsService.name).to(AdminAccountsService).inSingletonScope();
    this.container.bind<AdminAccountsService>(UserAccountsService.name).to(UserAccountsService).inSingletonScope();
    this.container.bind<IdGeneratorService>(IdGeneratorService.name).to(IdGeneratorService).inSingletonScope();
    this.container.bind<SensorsService>(SensorsService.name).to(SensorsService).inSingletonScope();
    this.container.bind<ActorsService>(ActorsService.name).to(ActorsService).inSingletonScope();
    this.container.bind<PasswordHashingService>(PasswordHashingService.name).to(PasswordHashingService).inSingletonScope();
  }
}
