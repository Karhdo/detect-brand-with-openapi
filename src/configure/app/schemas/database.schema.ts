import { IsIn, IsString, IsNumber, IsOptional } from 'class-validator';

type DATABASE_TYPE = 'mysql' | 'postgres' | 'mongo';

export class Database {
  @IsOptional()
  @IsIn(['mysql', 'postgres', 'mongo'])
  public readonly type: DATABASE_TYPE = 'postgres';

  @IsString()
  public readonly host: string = '127.0.0.1';

  @IsNumber()
  public readonly port: number = 5432;

  @IsString()
  public readonly username: string = 'postgres';

  @IsString()
  public readonly password: string = 'postgres';

  @IsString()
  public readonly database: string = 'postgres';
}

export class DatabaseConfig {
  readonly [K: string]: Database;
}
