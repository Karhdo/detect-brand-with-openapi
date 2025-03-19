import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class MinioConfig {
  @IsString()
  public readonly endPoint: string = 'localhost';

  @IsNumber()
  public readonly port: number = 9000;

  @IsOptional()
  @IsBoolean()
  public readonly useSSL: boolean = false;

  @IsOptional()
  @IsString()
  public readonly accessKey: string = 'minioadmin';

  @IsOptional()
  @IsString()
  public readonly secretKey: string = 'minioadmin';

  @IsOptional()
  @IsBoolean()
  public readonly deleteLocalFile: boolean = false;
}
