import { Module } from '@nestjs/common';
import { NoPovertyTargetService } from './no-poverty-target.service';
import { NoPovertyTargetController } from './no-poverty-target.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [NoPovertyTargetController],
  providers: [NoPovertyTargetService, PrismaService],
})
export class NoPovertyTargetModule {}
