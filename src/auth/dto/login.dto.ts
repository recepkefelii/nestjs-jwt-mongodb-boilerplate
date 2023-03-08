import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { RegisterDto } from "./register.dto";

export class LoginDto implements Omit<RegisterDto, "name"> {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}