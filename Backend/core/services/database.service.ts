import { inject, injectable } from "inversify";
import { LoggerService } from "./logger.service";
import { Connection, r, RConnectionOptions, RDatum } from "rethinkdb-ts";
import * as databaseConfiguration from "../../configuration/database-config.json";
import { Change } from "../../model/change.model";
import { User } from "../../model/user.model";

@injectable()
export class DatabaseService {
  constructor(
    @inject(LoggerService.name) private loggerService: LoggerService
  ) {}

  public async initialize(): Promise<boolean> {
    const connection = await this.connect();
    return r
      .dbList()
      .contains(databaseConfiguration.databaseName)
      .do((containsDatabase: RDatum<boolean>) => {
        return r.branch(
          containsDatabase,
          { created: 0 },
          r.dbCreate(databaseConfiguration.databaseName)
        );
      })
      .run(connection)
      .then(() => {
        this.loggerService.info("Trying to create tables");
        return this.createTables(connection)
          .then(() => {
            this.loggerService.info("Tables created");
            return Promise.resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(error);
            return Promise.reject(false);
          });
      });
  }

  private addChange(change: Change): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table("changes")
          .insert(change)
          .run(connection)
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(
              error,
              `Error while adding new change!: ${change}`
            );
            reject(false);
          });
      });
    });
  }

  public addUser(user: User): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table("users")
          .insert(user)
          .run(connection)
          .then(() => {
            this.addChange(
              new ConcreteChange(user.id, false, "users", "addUser")
            );
            resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(
              error,
              `Error while adding new user!: ${user}`
            );
            reject(false);
          });
      });
    });
  }

  public updateUser(user: User) {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table("users")
          .filter(r.row("id").eq(user.id))
          .update(user)
          .run(connection)
          .then(() => {
            this.addChange(
              new ConcreteChange(user.id, false, "users", "updateUser")
            );
            resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(
              error,
              `Error while updating new user!: ${user}`
            );
            reject(false);
          });
      });
    });
  }

  public getAllUsers(): Promise<Array<User>> {
    return new Promise((resolve) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table("users")
          .filter({})
          .run(connection)
          .then((response: Array<User>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, "Error while retrieving users!");
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

  private createTable(
    connection: Connection,
    tableName: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      r.db(databaseConfiguration.databaseName)
        .tableList()
        .contains(tableName)
        .do((containsTable: RDatum<boolean>) => {
          return r.branch(
            containsTable,
            { create: 0 },
            r.db(databaseConfiguration.databaseName).tableCreate(tableName)
          );
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
    const rethinkDbOptions: RConnectionOptions = {
      host: databaseConfiguration.databaseServer,
      port: databaseConfiguration.databasePort,
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

class ConcreteChange implements Change {
  actor_id: number;
  is_admin: boolean;
  table: string;
  action: string;
  timestamp: string;

  constructor(
    actor_id: number,
    is_admin: boolean,
    table: string,
    action: string
  ) {
    this.actor_id = actor_id;
    this.is_admin = is_admin;
    this.table = table;
    this.action = action;
    this.timestamp = Date.now().toString();
  }
}
