import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'task_manager_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  autoLoadEntities: true, // 👈 carga automática de entidades
  logging: true,
};
