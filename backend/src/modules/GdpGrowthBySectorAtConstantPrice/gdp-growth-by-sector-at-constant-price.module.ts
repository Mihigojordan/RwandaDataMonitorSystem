import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GdpGrowthBySectorAtConstantPriceService } from './gdp-growth-by-sector-at-constant-price.service';
import { GdpGrowthBySectorAtConstantPriceController } from './gdp-growth-by-sector-at-constant-price.controller';

@Module({
  providers: [PrismaService, GdpGrowthBySectorAtConstantPriceService],
  controllers: [GdpGrowthBySectorAtConstantPriceController],
})
export class GdpGrowthBySectorAtConstantPriceModule {}
