import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { GPDRecordService } from './gpdrecord.service';
import { Quarter } from 'generated/prisma';

@Controller('gpdrecord')
export class GPDRecordController {
  constructor(private readonly gpdRecordService: GPDRecordService) {}

  @Post()
  create(@Body() body: { 
    year: number; 
    quarter: Quarter; 
    amountBillionRwf: number; 
    isActive?: boolean 
  }) {
    return this.gpdRecordService.create(body);
  }

  @Get()
  findAll() {
    return this.gpdRecordService.findAll();
  }

  @Get('active')
  findActive() {
    return this.gpdRecordService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gpdRecordService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { 
      year?: number; 
      quarter?: Quarter; 
      amountBillionRwf?: number; 
      isActive?: boolean 
    },
  ) {
    return this.gpdRecordService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gpdRecordService.remove(id);
  }
}
