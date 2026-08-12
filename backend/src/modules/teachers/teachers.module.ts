import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService, PrismaService, UserModule],
})
export class TeachersModule {}
