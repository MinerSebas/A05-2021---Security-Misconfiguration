import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LoggerService {

  public info(...messages: string[]): void {
    console.info(messages);
  }

  public error(...messages: string[]): void {
    console.error(messages);
  }
}
