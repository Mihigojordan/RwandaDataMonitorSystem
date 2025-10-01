import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { GdpGrowthBySectorAtConstantPriceService } from './gdp-growth-by-sector-at-constant-price.service';

@Controller('gdp-growth-by-sector-at-constant-price')
export class GdpGrowthBySectorAtConstantPriceController {
  constructor(
    private readonly gdpGrowthService: GdpGrowthBySectorAtConstantPriceService,
  ) {}

  @Post()
  async create(@Body() data: any) {
    return this.gdpGrowthService.create(data);
  }

  @Get()
  async findAll() {
    return this.gdpGrowthService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.gdpGrowthService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.gdpGrowthService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.gdpGrowthService.remove(id);
  }
}
