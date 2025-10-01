import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { GdpCurrentPriceService } from './gdp-current-price.service';

@Controller('gdp-current-price')
export class GdpCurrentPriceController {
  constructor(private readonly service: GdpCurrentPriceService) {}

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
