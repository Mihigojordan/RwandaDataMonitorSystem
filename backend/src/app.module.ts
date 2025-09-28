import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './modules/admin-management/admin.module';
import { PrismaModule } from './prisma/prisma.module';

import { EmailModule } from './global/email/email.module';


import { NationalFiguresModule } from './modules/National_Figures/national-figures.module';
import { NoPovertyTargetModule } from './modules/No-poverty-management/no-poverty-target.module';

@Module({
  imports: [

    AdminModule,
    PrismaModule,

    EmailModule,

    NationalFiguresModule,
    NoPovertyTargetModule
  ],
  controllers: [AppController],
})
export class AppModule {}
