import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from "src/prisma.service";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'), 
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService],
        })
    ],
    controllers: [UserController],
    providers: [UserService, PrismaService, JwtStrategy],
    exports: [PassportModule, JwtStrategy, JwtModule],
})
export class UserModule { }
