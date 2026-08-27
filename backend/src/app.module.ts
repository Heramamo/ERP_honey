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
import { PoleModule } from './modules/pole/pole.module';
import { ChargeModule } from './modules/charge/charge.module';
import { RevenuModule } from './modules/revenu/revenu.module';
import { BilanModule } from './modules/bilan/bilan.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true, 
    }),UserModule, TeachersModule, SaisieFeuilleModule, PaieModule, FinanceModule, PoleModule, ChargeModule, RevenuModule, BilanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
