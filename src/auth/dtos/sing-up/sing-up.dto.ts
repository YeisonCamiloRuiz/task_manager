import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    fisrtName: string;

    @IsString()
    lastName: string;

    @IsString()
    @IsOptional()
    avatar: string;

}
