import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { GPDShareBySectorService } from './gpdsharebysector.service';

@Controller('gpdshare')
export class GPDShareBySectorController {
  constructor(private readonly gpdShareService: GPDShareBySectorService) {}

  @Post()
  create(@Body() body: { 
    year: number; 
    totalGDP: number; 
    service: number; 
    agriculture: number; 
    tax: number; 
    industry: number; 
    isActive?: boolean 
  }) {
    return this.gpdShareService.create(body);
  }

  @Get()
  findAll() {
    return this.gpdShareService.findAll();
  }

  @Get('active')
  findActive() {
    return this.gpdShareService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gpdShareService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { 
      year?: number; 
      totalGDP?: number; 
      service?: number; 
      agriculture?: number; 
      tax?: number; 
      industry?: number; 
      isActive?: boolean 
    },
  ) {
    return this.gpdShareService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gpdShareService.remove(id);
  }
}
