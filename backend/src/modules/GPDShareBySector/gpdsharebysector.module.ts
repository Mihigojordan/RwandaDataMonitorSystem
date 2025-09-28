import { Module } from '@nestjs/common';
import { GPDShareBySectorService } from './gpdsharebysector.service';
import { GPDShareBySectorController } from './gpdsharebysector.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GPDShareBySectorController],
  providers: [GPDShareBySectorService],
})
export class GPDShareBySectorModule {}
