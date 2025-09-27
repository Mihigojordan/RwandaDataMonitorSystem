import { Module } from '@nestjs/common';
import { NationalFiguresService } from './national-figures.service';
import { NationalFiguresController } from './national-figures.controller';

@Module({
  controllers: [NationalFiguresController],
  providers: [NationalFiguresService],
})
export class NationalFiguresModule {}
