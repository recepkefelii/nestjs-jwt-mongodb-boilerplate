import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { IUserPayload } from "./interface/user.interface";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
    logger: Logger
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService
    ) {
        this.logger = new Logger()
    }

    async register(body: RegisterDto) {
        try {

            // Hashed password
            const password = body.password
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            // Create Payload
            const payload: IUserPayload = {
                name: body.name,
                email: body.email,
            }

            // Create User
            await this.userModel.create({
                name: body.name,
                email: body.email,
                password: hashedPassword
            })

            return this.jwtSign(payload)

        } catch (error) {
            this.logger.error(error.message)
            throw new HttpException("There is already an account using this email", HttpStatus.CONFLICT)
        }

    }

    async login(body: LoginDto) {
        const user = await this.userModel.findOne({ email: body.email });

        if (!user) {
            throw new NotFoundException('No account with this email was found')
        }

        const decode = await bcrypt.compare(body.password, user.password)
        console.log(decode);

        if (!decode) {
            throw new UnauthorizedException('Authentication failed. Wrong password')
        }

        const payload: IUserPayload = {
            email: user.email,
            name: user.name,
            id: String(user._id)
        }

        return this.jwtSign(payload)
    }

    async jwtSign(payload: IUserPayload) {
        const accsessToken = this.jwtService.sign(payload)
        return { accessToken: accsessToken }
    }
}