import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { UserService } from './modules/user/user.service';
import { TeachersModule } from './modules/teachers/teachers.module';
import { ConfigModule } from '@nestjs/config';
import { SaisieFeuilleModule } from './modules/saisie_feuille/saisie_feuille.module';
import { PaieModule } from './modules/paie/paie.module';
import { FinanceModule } from './modules/finance/finance.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true, 
    }),UserModule, TeachersModule, SaisieFeuilleModule, PaieModule, FinanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
