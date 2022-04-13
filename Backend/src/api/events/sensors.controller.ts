import { inject, injectable } from "inversify";
import { controller, httpGet, httpPost, httpPut, interfaces, queryParam, request } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { DatabaseService } from "../../core/services/database.service";
import { Sensor } from "../../models/sensor.model";
import { SensorsService } from "../../core/services/sensors.service";
import { ChangeSensorData } from "../../models/change-sensor-data.model";

@controller('/sensors')
@injectable()
export class SensorsController implements interfaces.Controller{
    constructor(
        @inject(DatabaseService.name) private databaseService: DatabaseService,
        @inject(SensorsService.name) private sensorsService: SensorsService
      ) {}

    @httpGet('/lookup')
    public async getSensorsByOwnerID(@queryParam('ownerId') ownerId: string, request: Request, response: Response): Promise<void> {
      if (ownerId == 'undefined' || ownerId == null) {
        return response.status(400).json({ error: 'The owner ID was not defined!' });
      }
  
      this.databaseService.getSensorsByOwnerId(ownerId).then((result: Array<Sensor>) => {
        return response.status(200).json(result);
      });
    }

  @httpPut('/:id')
  public async updateExistingSensor(request: Request, response: Response): Promise<void> {
    try {
        if (!this.sensorsService.isSensorValid(request.body)) {
          return response.status(400).json({ error: this.sensorsService.errorMessage });
        }
  
        if (request.body.id != request.params.id) {
          return response.status(400).json({
            error: 'The ID of the sensor does not match the ID in the parameters!'
          });
        }
  
        var sensors = await this.databaseService.getSensorsById(request.body.id);
  
        if (!this.sensorsService.doSensorsBelongToOwner(sensors, request.body.ownerId)) {
          return response.status(401).json({
            error: `The given sensor with ID ${request.body.id} does not belong to the owner ${request.body.ownerId}!`
          });
        }
  
        let updatedSensor = await this.databaseService.updateSensor(request.params.id, request.body);
        return response.status(201).json(updatedSensor);
      } catch (err) {
        return response.status(400).json({ error: err.message });
      }
  }
}