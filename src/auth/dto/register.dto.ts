import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 12)
    name: string


    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

}

