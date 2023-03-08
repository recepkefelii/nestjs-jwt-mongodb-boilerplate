import { Body, Controller, Post } from "@nestjs/common";
import { RegisterDto } from "../dto/register.dto";
import { RegisterService } from "./register.service";

@Controller('auth')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }
    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.registerService.register(body)
    }
}