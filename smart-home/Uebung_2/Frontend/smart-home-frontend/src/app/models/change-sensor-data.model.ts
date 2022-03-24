import { MetaUser } from "./meta-user.model";
import { Sensor } from "./sensor.model";

export interface ChangeSensorData{
    sensor: Sensor;
    user: MetaUser;
    role: string;
}