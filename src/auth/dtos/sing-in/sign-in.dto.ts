import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class RefreshAccesTokenDto {
    @IsString()
    refreshToken: string;
}

export class RefreshTokenDto {
    @IsString()
    accesToken: string;

    @IsString()
    refreshToken: string;
}
