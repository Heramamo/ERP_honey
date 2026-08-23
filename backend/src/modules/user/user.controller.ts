import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }
    @Post('register')
    @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
    @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès.' })
    @ApiResponse({ status: 409, description: 'Email déjà utilisé.' })
    register(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'Connexion utilisateur' })
    @ApiResponse({ status: 200, description: 'Connexion réussie, retourne le JWT.' })
    @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
    async login(@Body() loginDto: LoginUserDto) {
        return this.userService.loginUser(loginDto);
    }
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('change-password')
    @ApiOperation({ summary: "Changer le mot de passe de l'utilisateur connecté" })
    @ApiResponse({ status: 200, description: 'Mot de passe modifié avec succès.' })
    @ApiResponse({ status: 401, description: 'Mot de passe actuel incorrect.' })
    changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
        return this.userService.changePassword(req.user.sub, dto);
    }
}
