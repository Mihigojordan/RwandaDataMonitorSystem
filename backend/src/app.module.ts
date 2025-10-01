import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './modules/admin-management/admin.module';
import { PrismaModule } from './prisma/prisma.module';

import { EmailModule } from './global/email/email.module';


import { NationalFiguresModule } from './modules/National_Figures/national-figures.module';
import { NoPovertyTargetModule } from './modules/No-poverty-management/no-poverty-target.module';
import { GdpCurrentPriceModule } from './modules/gdpcurrentprice/gdp-current-price.module';
import { GdpShareModule } from './modules/GdpShareBySector/gdp-share.module';
import { GdpGrowthBySectorAtConstantPriceService } from './modules/GdpGrowthBySectorAtConstantPrice/gdp-growth-by-sector-at-constant-price.service';
import { GdpGrowthBySectorAtConstantPriceModule } from './modules/GdpGrowthBySectorAtConstantPrice/gdp-growth-by-sector-at-constant-price.module';

@Module({
  imports: [

    AdminModule,
    PrismaModule,

    EmailModule,

    NationalFiguresModule,
    NoPovertyTargetModule,
    GdpCurrentPriceModule,
    GdpShareModule,
    GdpGrowthBySectorAtConstantPriceModule
  ],
  controllers: [AppController],
})
export class AppModule {}
