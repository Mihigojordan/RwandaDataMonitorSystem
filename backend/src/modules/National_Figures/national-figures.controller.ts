import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { NationalFiguresService } from './national-figures.service';

@Controller('national-figures')
export class NationalFiguresController {
  constructor(private readonly nationalFiguresService: NationalFiguresService) {}

  @Post()
  async create(@Body() body: { indicatorName: string; money: number; year: number; quarter: number }) {
    try {
      return await this.nationalFiguresService.create(body);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.nationalFiguresService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.nationalFiguresService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { indicatorName?: string; money?: number; year?: number; quarter?: number },
  ) {
    try {
      return await this.nationalFiguresService.update(id, body);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.nationalFiguresService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
