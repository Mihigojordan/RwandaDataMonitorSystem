import { Module } from '@nestjs/common';
import { GdpShareService } from './gdp-share.service';
import { GdpShareController } from './gdp-share.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [GdpShareController],
  providers: [GdpShareService, PrismaService],
})
export class GdpShareModule {}