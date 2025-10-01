import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GdpCurrentPriceService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    lastYear: { year: number; quarter: string; money: number };
    currentYear: { year: number; quarter: string; money: number };
    trends?: { year: number; quarter: string; money: number }[];
  }) {
    try {
      return await this.prisma.gdpCurrentPrice.create({ data });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create GDP record');
    }
  }

async findAll() {
  try {
    return await this.prisma.gdpCurrentPrice.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException('Failed to fetch GDP records');
  }
}


  async findOne(id: string) {
    try {
      const record = await this.prisma.gdpCurrentPrice.findUnique({ where: { id } });
      if (!record) throw new NotFoundException('GDP record not found');
      return record;
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to fetch GDP record');
    }
  }

  async update(
    id: string,
    data: {
      lastYear?: { year: number; quarter: string; money: number };
      currentYear?: { year: number; quarter: string; money: number };
      trends?: { year: number; quarter: string; money: number }[];
    },
  ) {
    try {
      return await this.prisma.gdpCurrentPrice.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update GDP record');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.gdpCurrentPrice.delete({ where: { id } });
      return { message: 'GDP record deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete GDP record');
    }
  }
}

