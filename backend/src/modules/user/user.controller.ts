import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }
    @Post("register")
    register(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }
    @HttpCode(HttpStatus.OK) 
    @Post('login')
    @ApiOperation({ summary: 'Connexion utilisateur' })
    @ApiResponse({ status: 200, description: 'Connexion réussie, retourne le JWT.' })
    @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
    async login(@Body() loginDto: LoginUserDto) {
        return this.userService.loginUser(loginDto);
    }
}
