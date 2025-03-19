import { IsOptional, ValidateNested } from 'class-validator';
import { Expose, plainToInstance, Type } from 'class-transformer';

import { AppConfig } from './app.schema';
import { MinioConfig } from './minio.schema';
import { OpenAIConfig } from './open-ai.schema';
import { DatabaseConfig, Database } from './database.schema';

import { NestedObjectTransform, NestedObjectValidator } from 'common/decorators';

export class EnvironmentConfig {
  @Type(() => AppConfig)
  @Expose()
  @ValidateNested()
  public readonly app: AppConfig;

  @Type(() => MinioConfig)
  @Expose()
  @ValidateNested()
  public readonly minio: MinioConfig;

  @Type(() => OpenAIConfig)
  @Expose()
  @ValidateNested()
  public readonly open_ai: OpenAIConfig;

  @IsOptional()
  @NestedObjectValidator(Database)
  @NestedObjectTransform(Database, ({ value }) => {
    return plainToInstance(DatabaseConfig, value);
  })
  public readonly database: DatabaseConfig;
}
