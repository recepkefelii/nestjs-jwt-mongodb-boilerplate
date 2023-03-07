import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthDto } from "./dto/auth.dto";
import { User, UserDocument } from "./schema/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { IUserPayload } from "./interface/user.interface";

@Injectable()
export class AuthService {
    logger: Logger
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService
    ) {
        this.logger = new Logger()
    }

    async register(body: AuthDto) {
        try {

            // Hashed password
            const password = body.password
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            // Create Payload
            const userPayload: IUserPayload = {
                name: body.name,
                email: body.email,
            }

            // Create User
            await this.userModel.create({
                name: body.name,
                email: body.email,
                password: hashedPassword
            })
            const accessToken = await this.jwtSign(userPayload)

            return { acessToken: accessToken }
        } catch (error) {
            this.logger.error(error.message)
            throw new HttpException("there is already an account using this email", HttpStatus.CONFLICT)
        }

    }

    async login(body: AuthDto) {
        const user = this.userModel.find({ name: body.name })
        console.log(user);

    }

    async jwtSign(payload: IUserPayload) {
        return this.jwtService.sign(payload)
    }
}