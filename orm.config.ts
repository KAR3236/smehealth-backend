import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const ormConfig: (
  configService: ConfigService,
) => TypeOrmModuleOptions = (configService) => ({
  type: 'postgres',
  username: configService.get('DBUSER', 'postgres'),
  password: configService.get('DBPASS', 'Postgres'),
  port: configService.get('DBPORT', 5432),
  host: configService.get('DBHOST', 'localhost'),
  database: configService.get('DBNAME', 'smehealth'),
  synchronize: false,
  schema: configService.get('DBSCHEMA', 'public2'),
  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
  migrations: [join(__dirname, '**/migrations/*{.ts,.js}')],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
});

config();

const configService = new ConfigService();

//configuration for typeorm cli
export default new DataSource({
  type: 'postgres',
  username: configService.get('DBUSER', 'postgres'),
  password: configService.get('DBPASS', 'Postgres'),
  port: configService.get('DBPORT', 5432),
  host: configService.get('DBHOST', 'localhost'),
  database: configService.get('DBNAME', 'smehealth'),
  synchronize: false,
  schema: configService.get('DBSCHEMA', 'public2'),
  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
  migrations: [join(__dirname, '**/migrations/*{.ts,.js}')],
  logging: true,
});
