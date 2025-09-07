import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/sing-in/sign-in.dto';
import { SignUpDto } from '../dtos/sing-up/sing-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
	JwtPayload,
	refreshTokenPayload,
} from '../interfaces/jwtpayload.interface';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	async generateToken(payload: JwtPayload) {
		return this.jwtService.sign(payload);
	}

	async generaterefreshToken(payload: JwtPayload) {
		return this.jwtService.sign(payload, {
		secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
		expiresIn: '3d',
		});
	}

	async singIn(body: SignInDto) {
		console.log(`El usuario ${body.email} esta intentado iniciar session`);

		const user = await this.userRepository.findOne({
			where: { email: body.email },
		});

		if (!user) {
			console.log('User not found');
			throw new UnauthorizedException({
				success: false,
				message: 'User not found',
			});
		}

		const { id, email, password, firstName, lastName, isActive, roleId } = user;

		if (!isActive) {
			console.log(`El usuario ${email} esta inactivo`);
			throw new UnauthorizedException({
				success: false,
				message: 'Inactive user',
			});
		}

		const isValidPassword = await bcrypt.compare(body.password, password);

		if (!isValidPassword) {
			console.log('Invalid password');
			throw new UnauthorizedException({
				success: false,
				message: 'Invalid password',
			});
		}

		const payloadToken = {
			sub: id,
			email,
			roleId,
			firstName,
			lastName,
		};

		const accessToken = await this.generateToken(payloadToken);

		const refreshToken = await this.generaterefreshToken(payloadToken);

		await this.userRepository.update(id, { accessToken, refreshToken });


		const userData = {
			accessToken,
			refreshToken,
		};

		return { sucess: true, data: userData };
	}

	async singUp(body: SignUpDto) {
		Logger.debug(`El correo ${body.email} se esta intentando registrar`);

		const user = await this.userRepository.findOne({
			where: { email: body.email },
		});

		if (user){
			Logger.debug(`El correo ${body.email} ya esta registrado`);
			throw new BadRequestException({
				success: false,
				message: `El usuario ${body.email} ya esta registrado`
			})
		}

		const hashedPassword = await bcrypt.hash(body.password, 10);

		const newUser = this.userRepository.create({
			email:body.email,
			password:hashedPassword,
			firstName:body.fisrtName,
			lastName:body.lastName
		})

		await this.userRepository.save(newUser);

		const payload = {
			sub: newUser.id,
			email: newUser.email,
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			roleId: newUser.roleId,
		};

		const accessToken = await this.generateToken(payload);
		const refreshToken = await this.generaterefreshToken(payload);

		await this.userRepository.update(newUser.id, { accessToken, refreshToken });

		return {
			success: true,
			data: {
				accessToken,
				refreshToken,
				user: {
					id: newUser.id,
					email: newUser.email,
					firstName: newUser.firstName,
					lastName: newUser.lastName,
					roleId: newUser.roleId,
				}
			}
		}
	}

	async refreshAccesToken(refreshTokenParam: string) {
		if (!refreshTokenParam) {
			throw new BadRequestException({
				success: false,
				message: 'No se proporcionó el refresh token',
			});
		}

		try {
			const payload = this.jwtService.verify(refreshTokenParam, {
				secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
			});

			const { sub } = payload;

			const user = await this.userRepository.findOne({ where: { id: sub } });

			if (!user) {
				throw new UnauthorizedException({
					success: false,
					message: 'Usuario no encontrado',
				});
			}

			const { id, email, firstName, lastName, isActive, roleId } = user;

			if (!isActive) {
				throw new UnauthorizedException({
					success: false,
					message: 'Usuario inactivo',
				});
			}

			const newAccessToken = this.jwtService.sign(
				{
					sub: id,
					email,
					firstName,
					lastName,
					roleId
				},
				{
					secret: process.env.JWT_SECRET || 'mi_super_secreto',
					expiresIn: '1h',
				},
			);

			await this.userRepository.update(id, { accessToken: newAccessToken });

			return {
				success: true,
				data:{
					accessToken: newAccessToken,
					refreshToken: refreshTokenParam
				}
			};
		} catch (error) {
			throw new UnauthorizedException({
				success: false,
				message: 'El refresh token no es válido o ha expirado',
			});
		}
	}

	async refreshTokens(refreshTokenParam: string) {
		if (!refreshTokenParam) {
			throw new BadRequestException({
				success: false,
				message: 'No se proporcionó el refresh token',
			});
		}

		try {
			// Verificar refresh token existente
			const payload = this.jwtService.verify(refreshTokenParam, {
				secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
			});

			const { sub } = payload;

			const user = await this.userRepository.findOne({ where: { id: sub } });

			if (!user) {
				throw new UnauthorizedException({
					success: false,
					message: 'Usuario no encontrado',
				});
			}

			const { id, email, firstName, lastName, isActive, roleId } = user;

			if (!isActive) {
				throw new UnauthorizedException({
					success: false,
					message: 'Usuario inactivo',
				});
			}

			// Generar nuevo access token
			const newAccessToken = this.jwtService.sign(
				{
					sub: id,
					email,
					firstName,
					lastName,
					roleId,
				},
				{
					secret: process.env.JWT_SECRET || 'mi_super_secreto',
					expiresIn: '1h',
				},
			);

			// Generar nuevo refresh token
			const newRefreshToken = this.jwtService.sign(
				{
					sub: id,
				},
				{
					secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
					expiresIn: '7d',
				},
			);

			// Guardar tokens en DB (opcional pero recomendado)
			await this.userRepository.update(id, {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			});

			return {
				success: true,
				data: {
					accessToken: newAccessToken,
					refreshToken: newRefreshToken,
				},
			};
		} catch (error) {
			throw new UnauthorizedException({
				success: false,
				message: 'El refresh token no es válido o ha expirado',
			});
		}
	}

}
