import { inject, injectable } from 'inversify';
import { LoggerService } from './logger.service';
import { Connection, r, RDatum } from 'rethinkdb-ts';
import * as databaseConfiguration from '../../configuration/database-config.json';
import { AdminAccount } from '../../models/admin-account.model';
import { ChangeAdminPasswordData } from '../../models/change-admin-password-data.model';
import { ChangeAdminUsernameData } from '../../models/change-admin-username-data.model';
import { UserAccount } from '../../models/user-account.model';
import { ChangeUserPasswordData } from '../../models/change-user-password-data.model';
import { ChangeUserUsernameData } from '../../models/change-user-username-data.model';
import { Sensor } from '../../models/sensor.model';
import { Actor } from '../../models/actor.model';
import { ChangeSensorData } from '../../models/change-sensor-data.model';
import { ChangeActorData } from '../../models/change-actor-data.model';

@injectable()
export class DatabaseService {

  constructor(@inject(LoggerService.name) private loggerService: LoggerService) {}

  public async initialize(): Promise<boolean> {
    const connection = await this.connect();
    r.dbList()
      .contains(databaseConfiguration.databaseName)
      .do((containsDatabase: RDatum<boolean>) => {
        return r.branch(containsDatabase, { created: 0 }, r.dbCreate(databaseConfiguration.databaseName));
      })
      .run(connection)
      .then(() => {
        this.loggerService.info('Trying to create tables');
        this.createTables(connection)
          .then(() => {
            this.loggerService.info('Tables created');
            return Promise.resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(error);
            return Promise.reject(false);
          });
      });
    return Promise.resolve(true);
  }

  public async insertAdminAccount(account: AdminAccount): Promise<AdminAccount> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('smarthm_admin_accounts')
          .insert({
            personId: account.personId,
            userName: account.userName,
            passWord: account.passWord
          })
          .run(connection)
          .then(() => {
            resolve(account);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while inserting new account');
            reject(account);
          });
      });
    });
  }

     public async insertUserAccount(account: UserAccount): Promise<UserAccount> {
      return new Promise((resolve, reject) => {
        this.connect().then((connection: Connection) => {
          r.db(databaseConfiguration.databaseName)
            .table('smarthm_user_accounts')
            .insert({
              personId: account.personId,
              userName: account.userName,
              passWord: account.passWord
            })
            .run(connection)
            .then(() => {
              resolve(account);
            })
            .catch((error) => {
              this.loggerService.error(error, 'Error while inserting new account');
              reject(account);
            });
        });
      });
    }

  public async updateAdminPassword(passWordData: ChangeAdminPasswordData): Promise<ChangeAdminPasswordData> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('smarthm_admin_accounts')
          .filter({
            personId: passWordData.adminId
          })
          .update({
            passWord: passWordData.newPassword
          })
          .run(connection)
          .then(() => {
            resolve(passWordData);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while updating the password');
            reject(passWordData);
          });
      });
    });
  }

  public async updateUserPassword(passWordData: ChangeUserPasswordData): Promise<ChangeUserPasswordData> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('smarthm_user_accounts')
          .filter({
            personId: passWordData.userId
          })
          .update({
            passWord: passWordData.newPassword
          })
          .run(connection)
          .then(() => {
            resolve(passWordData);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while updating the password');
            reject(passWordData);
          });
      });
    });
  }

  public async updateAdminUsername(usernameData: ChangeAdminUsernameData): Promise<ChangeAdminUsernameData> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('smarthm_admin_accounts')
          .filter({
            personId: usernameData.adminId
          })
          .update({
            userName: usernameData.newUsername
          })
          .run(connection)
          .then(() => {
            resolve(usernameData);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while updating the username');
            reject(usernameData);
          });
      });
    });
  }

     public async updateUserUsername(usernameData: ChangeUserUsernameData): Promise<ChangeUserUsernameData> {
      return new Promise((resolve, reject) => {
        this.connect().then((connection: Connection) => {
          r.db(databaseConfiguration.databaseName)
            .table('smarthm_user_accounts')
            .filter({
              personId: usernameData.userId
            })
            .update({
              userName: usernameData.newUsername
            })
            .run(connection)
            .then(() => {
              resolve(usernameData);
            })
            .catch((error) => {
              this.loggerService.error(error, 'Error while updating the username');
              reject(usernameData);
            });
        });
      });
    }

  public async getAdminAccounts(): Promise<Array<AdminAccount>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('smarthm_admin_accounts')
          .filter({})
          .run(connection)
          .then((response: Array<AdminAccount>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving the admin accounts');
          });
      });
    });
  }

     public async getUserAccounts(): Promise<Array<UserAccount>> {
      return new Promise((resolve, reject) => {
        this.connect().then((connection: Connection) => {
          r.db(databaseConfiguration.databaseName)
            .table('smarthm_user_accounts')
            .filter({})
            .run(connection)
            .then((response: Array<UserAccount>) => {
              resolve(response);
            })
            .catch((error) => {
              this.loggerService.error(error, 'Error while retrieving the user accounts');
            });
        });
      });
    }

  public async getAdminAccountsByID(id: string): Promise<Array<AdminAccount>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('smarthm_admin_accounts')
          .filter({
            personId: id
          })
          .run(connection)
          .then((response: Array<AdminAccount>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving the admin accounts');
          });
      });
    });
  }

  public async getUserAccountsByID(id: string): Promise<Array<UserAccount>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('smarthm_user_accounts')
          .filter({
            personId: id
          })
          .run(connection)
          .then((response: Array<AdminAccount>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving the user accounts');
          });
      });
    });
  }

  public async getAdminAccountByCredentials(userName: string, passWord: string): Promise<Array<AdminAccount>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('smarthm_admin_accounts')
          .filter({
            userName: userName,
            passWord: passWord
          })
          .limit(1)
          .run(connection)
          .then((response: Array<AdminAccount>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving the admin account');
          });
      });
    });
  }

  public async getUserAccountByCredentials(userName: string, passWord: string): Promise<Array<UserAccount>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('smarthm_user_accounts')
          .filter({
            userName: userName,
            passWord: passWord
          })
          .limit(1)
          .run(connection)
          .then((response: Array<UserAccount>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving the user account');
          });
      });
    });
  }

  public async getAdminAccountByUserName(userName: string): Promise<Array<AdminAccount>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('smarthm_admin_accounts')
          .filter({
            userName: userName
          })
          .limit(1)
          .run(connection)
          .then((response: Array<AdminAccount>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving the admin account');
          });
      });
    });
  }

  public async getUserAccountByUserName(userName: string): Promise<Array<UserAccount>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('smarthm_user_accounts')
          .filter({
            userName: userName
          })
          .limit(1)
          .run(connection)
          .then((response: Array<UserAccount>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving the user account');
          });
      });
    });
  }

  public async getSensorsByOwnerId(id : string): Promise<Array<Sensor>>{
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('sensors')
          .filter({
            ownerId: id
          })
          .run(connection)
          .then((response: Array<Sensor>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving the sensors');
          });
      });
    });
  }

  public async getSensorsById(id : string): Promise<Array<Sensor>>{
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('sensors')
          .filter({
            id : id
          })
          .limit(1)
          .run(connection)
          .then((response: Array<Sensor>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving the sensor');
          });
      });
    });
  }

  public async getActorsByOwnerId(id : string): Promise<Array<Actor>>{
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('actors')
          .filter({
            ownerId: id
          })
          .run(connection)
          .then((response: Array<Actor>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving the actors');
          });
      });
    });
  }

  public async getActorsById(id : string): Promise<Array<Actor>>{
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('actors')
          .filter({
            id : id
          })
          .limit(1)
          .run(connection)
          .then((response: Array<Actor>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving the actor');
          });
      });
    });
  }

  public async updateSensor(sensorId : string, sensor : Sensor): Promise<Sensor> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('sensors')
          .filter({
            id: sensorId
          })
          .update({
            value : sensor.value
          })
          .run(connection)
          .then(() => {
            resolve(sensor);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while updating the sensor');
            reject(sensor);
          });
      });
    });
  }

  public async updateActor(actorId : string, actor : Actor): Promise<Actor> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('actors')
          .filter({
            id: actorId
          })
          .update({
            valueChange : actor.valueChange
          })
          .run(connection)
          .then(() => {
            resolve(actor);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while updating the actor');
            reject(actor);
          });
      });
    });
  }

  public async insertSensor(sensor: Sensor): Promise<Sensor> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('sensors')
          .insert({
            ownerId: sensor.ownerId,
            value: sensor.value
          })
          .run(connection)
          .then(() => {
            resolve(sensor);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while inserting new sensor');
            reject(sensor);
          });
      });
    });
  }

  public async insertActor(actor: Actor): Promise<Actor> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('actors')
          .insert({
            ownerId: actor.ownerId,
            valueChange: actor.valueChange
          })
          .run(connection)
          .then(() => {
            resolve(actor);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while inserting new actor');
            reject(actor);
          });
      });
    });
  }

  private createTables(connection: Connection): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const promises = new Array<Promise<boolean>>();
      databaseConfiguration.databaseTables.forEach((table) => {
        promises.push(this.createTable(connection, table));
      });
      Promise.all(promises)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          this.loggerService.error(error);
          reject(false);
        });
    });
  }

  private createTable(connection: Connection, tableName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      r.db(databaseConfiguration.databaseName)
        .tableList()
        .contains(tableName)
        .do((containsTable: RDatum<boolean>) => {
          return r.branch(containsTable, { create: 0 }, r.tableCreate(tableName));
        })
        .run(connection)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          this.loggerService.error(error);
          reject(false);
        });
    });
  }

  private connect(): Promise<Connection> {
    const rethinkDbOptions = {
      host: databaseConfiguration.databaseServer,
      port: databaseConfiguration.databasePort
    };
    return new Promise((resolve, reject) => {
      r.connect(rethinkDbOptions)
        .then((connection: Connection) => {
          resolve(connection);
        })
        .catch(reject);
    });
  }
}
