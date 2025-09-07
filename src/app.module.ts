import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { UserStorysModule } from './user-storys/user-storys.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ColumnsModule } from './columns/columns.module';
import { RolesPermissionsModule } from './roles-permissions/roles-permissions.module';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './core/config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ProjectsModule,
    UserStorysModule,
    TeamsModule,
    UsersModule,
    TasksModule,
    ColumnsModule,
    RolesPermissionsModule,
    AuthModule,
    TypeOrmModule.forRoot(databaseConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
