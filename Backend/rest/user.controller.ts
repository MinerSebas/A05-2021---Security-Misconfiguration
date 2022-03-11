import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import {
  controller,
  httpPatch,
  httpPost,
  interfaces,
} from "inversify-express-utils";
import { DatabaseService } from "../core/services/database.service";
import { User } from "../model/user.model";

@controller("/users")
@injectable()
export class UsersController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService
  ) {}

  @httpPost("/")
  public postUser(request: Request, response: Response): void {
    const name = request.header("name");
    const key = request.header("key");

    if (name === undefined) {
      response.writeHead(400).end("Missing `name` Header");
      return;
    }
    if (key === undefined) {
      response.writeHead(400).end("Missing `key` Header");
      return;
    }

    this.databaseService.getAllUsers().then((result: Array<User>) => {
      if (
        result.some((user) => {
          return user.key === key;
        })
      ) {
        response.writeHead(409).end("Key is already in use.");
        return;
      }

      const newUser: User = {
        id: this.GetNewId(result),
        key: key,
        name: name,
        timestamp: Date.now(),
        checked_in: true,
      };

      this.databaseService.addUser(newUser).then(() => {
        response.writeHead(201).end("");
      });
    });
  }

  private GetNewId(users: Array<User>): number {
    if (users.length === 0) {
      return 1;
    }

    const newestUser = users.reduce(
      (previousValue: User, currentValue: User) => {
        if (previousValue.id >= currentValue.id) {
          return previousValue;
        } else {
          currentValue;
        }
      }
    );

    return newestUser.id + 1;
  }

  @httpPatch("/")
  public patchUser(request: Request, response: Response): void {
    const key = request.header("key");

    if (key === undefined) {
      response.writeHead(400).end("Missing `key` Header");
      return;
    }

    this.databaseService.getAllUsers().then((result: Array<User>) => {
      const user = result.find((user) => {
        return user.key === key;
      });

      if (user === undefined) {
        response.writeHead(404).end("Key is not in use.");
        return;
      }

      user.checked_in = false;

      this.databaseService.updateUser(user).then(() => {
        response.writeHead(204).end("");
      });
    });
  }
}
