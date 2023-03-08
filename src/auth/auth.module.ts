import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ChangePasswordModule } from "./change-password/change.password.module";
import { LoginModule } from "./login/login.module";
import { RegisterModule } from "./register/register.module";


@Module({
    imports: [LoginModule, RegisterModule, ChangePasswordModule],
})
export class AuthModule { }