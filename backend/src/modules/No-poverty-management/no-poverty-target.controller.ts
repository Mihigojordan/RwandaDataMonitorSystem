import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { NoPovertyTargetService } from './no-poverty-target.service';

@Controller('no-poverty-targets')
export class NoPovertyTargetController {
  constructor(private readonly service: NoPovertyTargetService) {}

  @Post()
  create(@Body() data) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
