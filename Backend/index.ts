import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { IocContainer } from "./core/ioc/ioc.container";
import { LoggerService } from "./core/services/logger.service";
import { DatabaseService } from "./core/services/database.service";
import * as cors from "cors";

const container = new IocContainer();
container.init();

const logger = container.getContainer().resolve(LoggerService);
const databseService = container.getContainer().resolve(DatabaseService);

const server = new InversifyExpressServer(container.getContainer());

databseService
  .initialize()
  .then(() => {
    logger.info("Initialized DB.");
    const app = server
      .setConfig((app) => {
        app.use(cors());
      })
      .build();
    app.listen(9999);
    logger.info("Server listening on port 9999");
  })
  .catch((error) => {
    logger.info(error, "Failed to Initialized DB.");
    process.exit(-1);
  });
