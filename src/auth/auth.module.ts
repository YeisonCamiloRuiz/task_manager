import { Module } from '@nestjs/common';
import { AuthController } from './controlers/auth.controller';
import { AuthService } from './services/auth.service';
import { User } from './entities/user.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'mi_super_secreto', // usa env en producción
			signOptions: { expiresIn: '1h' }, // tiempo de expiración
		}),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
