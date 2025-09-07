import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RefreshAccesTokenDto, RefreshTokenDto, SignInDto } from '../dtos/sing-in/sign-in.dto';
import { SignUpDto } from '../dtos/sing-up/sing-up.dto';

@Controller('auth')
export class AuthController {
	
	constructor(private readonly authService: AuthService) {}

	@Post('/sing-in')
	singIn(@Body() body: SignInDto) {
		return this.authService.singIn(body);
	}

	@Post('/sing-up')
	singUp(@Body() body: SignUpDto) {
		return this.authService.singUp(body);
	}

	@Post('/refresh-acces-token')
	refreshAccesToken(@Body() body: RefreshAccesTokenDto) {
		return this.authService.refreshAccesToken(body.refreshToken);
	}

	@Post('/refresh-token')
	refreshTokens(@Body() body:RefreshAccesTokenDto){
		return this.authService.refreshTokens(body.refreshToken)
	}

	
}
