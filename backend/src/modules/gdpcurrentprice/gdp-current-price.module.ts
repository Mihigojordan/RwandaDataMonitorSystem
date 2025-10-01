import { Module } from '@nestjs/common';
import { GdpCurrentPriceService } from './gdp-current-price.service';
import { GdpCurrentPriceController } from './gdp-current-price.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [GdpCurrentPriceController],
  providers: [GdpCurrentPriceService, PrismaService],
})
export class GdpCurrentPriceModule {}
