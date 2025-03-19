import { IsNumber } from 'class-validator';

export class AppConfig {
  @IsNumber()
  public readonly port: number = 3010;
}
