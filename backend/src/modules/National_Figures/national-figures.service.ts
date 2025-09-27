import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NationalFiguresService {
  constructor(private prisma: PrismaService) {}

  async create(data: { indicatorName: string; money: number; year: number; quarter: number }) {
    try {
      return await this.prisma.nationalFigure.create({ data });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create national figure indicator');
    }
  }

  async findAll() {
    try {
      return await this.prisma.nationalFigure.findMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch national figures');
    }
  }

  async findOne(id: string) {
    try {
      const record = await this.prisma.nationalFigure.findUnique({ where: { id } });
      if (!record) throw new NotFoundException('National figure not found');
      return record;
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to fetch national figure');
    }
  }

  async update(id: string, data: { indicatorName?: string; money?: number; year?: number; quarter?: number }) {
    try {
      return await this.prisma.nationalFigure.update({ where: { id }, data });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update national figure');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.nationalFigure.delete({ where: { id } });
      return { message: 'National figure deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete national figure');
    }
  }
}
