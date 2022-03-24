import 'reflect-metadata';
import { IoContainer } from './core/ioc/ioc.container';
import { LoggerService } from './core/services/logger.service';
import * as express from 'express';
import * as backendConfiguration from '../src/configuration/backend-config.json';
import { InversifyExpressServer } from 'inversify-express-utils';
import { DatabaseService } from './core/services/database.service';

const cors = require('cors');
const bodyParser = require('body-parser');
const container = new IoContainer();
container.init();

const logger = container.getContainer().resolve(LoggerService);
const databaseService = container.getContainer().resolve(DatabaseService);
const server = new InversifyExpressServer(container.getContainer());

databaseService
  .initialize()
  .then(() => {
    const app = server
      .setConfig((app) => {
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express.urlencoded({ extended: true }));
      })
      .build();
    app.listen(backendConfiguration.backendPort);
  })
  .catch((error) => {
    logger.error(error, 'Error while starting Express server');
  });
