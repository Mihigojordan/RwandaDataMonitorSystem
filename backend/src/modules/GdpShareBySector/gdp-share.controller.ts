import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { GdpShareService } from './gdp-share.service';

@Controller('gdp-shares')
export class GdpShareController {
  constructor(private readonly service: GdpShareService) {}

  @Post()
  create(@Body() data: {
    totalGdp: number;
    servicesShare: number;
    industryShare: number;
    agricultureShare: number;
    taxesShare: number;
    privateSector?: number;
    governmentSector?: number;
    imports?: number;
    exports?: number;
  }) {
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
  update(
    @Param('id') id: string,
    @Body() data: {
      totalGdp?: number;
      servicesShare?: number;
      industryShare?: number;
      agricultureShare?: number;
      taxesShare?: number;
      privateSector?: number;
      governmentSector?: number;
      imports?: number;
      exports?: number;
    },
  ) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}