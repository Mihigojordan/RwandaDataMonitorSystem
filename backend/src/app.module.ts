import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './modules/admin-management/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { DepartmentModule } from './modules/department/department.module';

import { EmailModule } from './global/email/email.module';


import { ActivityModule } from './modules/activity-management/activity.module';
import { NationalFiguresModule } from './modules/National_Figures/national-figures.module';

@Module({
  imports: [

    AdminModule,
    PrismaModule,

    EmailModule,

    ActivityModule,
    NationalFiguresModule
  ],
  controllers: [AppController],
})
export class AppModule {}
