import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Module, Logger } from '@nestjs/common';

import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { Database } from 'configure/app/schemas';

import { DatabaseModuleOption } from './database.interface';

@Module({})
export class DatabaseModule {
  private static readonly logger = new Logger(DatabaseModule.name);

  public static forRootAsync(options: DatabaseModuleOption): DynamicModule {
    const { name, entities } = options;

    return {
      module: DatabaseModule,
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const config = configService.get<Database>(`database.${name}`);

            if (!config) {
              throw new Error(`Database configuration for '${name}' is missing`);
            }

            const { type, host, port, username, password, database } = config;

            const sequelize = new Sequelize({
              dialect: type as Dialect,
              host,
              port,
              username,
              password,
              database,
              logging: false,
            });

            try {
              await sequelize.authenticate();

              const connectionString = this.getConnectionString({ type, host, port, database });

              this.logger.log(`Connected successfully to database ${connectionString}`);
            } catch (error) {
              this.logger.error(`Unable to connect to the database: ${error}`);
            } finally {
              void sequelize.close();
            }

            return {
              dialect: type as Dialect,
              host,
              port,
              username,
              password,
              database,
              entities,
              logging: false,
            };
          },
        }),
      ],
      exports: [SequelizeModule],
      global: true,
    };
  }

  private static getConnectionString(options: { type: string; host: string; port: number; database: string }): string {
    const { type, host, port, database } = options;

    return `${type}://${host}:${port}/${database}`;
  }
}
