import { injectable } from "inversify";
import { Sensor } from "../../models/sensor.model";

@injectable()
export class SensorsService {
    public errorMessage: string;

    public getDefaultSensor(ownerId : string) : Sensor{
        var sensor = {
            ownerId : ownerId,
            value : 0
        } as Sensor;

        return sensor;
    }

    public isSensorValid(sensor: Sensor) : boolean {
        this.errorMessage = "";
        if (!(sensor.value >= 0 && sensor.value <= 100)){
            this.errorMessage = "The value has to lie between 0 and 100!";
            return false;
        }

        return true;
    }

    public doSensorsBelongToOwner(sensors: Array<Sensor>, ownerId: string): boolean {
        if (sensors == null || sensors == undefined || sensors.length == 0) {
          return false;
        }
    
        for (var sensor of sensors) {
          if (sensor.ownerId != ownerId) {
            return false;
          }
        }
    
        return true;
      }
}