import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GPDShareBySectorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { 
    year: number; 
    totalGDP: number; 
    service: number; 
    agriculture: number; 
    tax: number; 
    industry: number; 
    isActive?: boolean 
  }) {
    const { isActive, ...rest } = data;

    return this.prisma.$transaction(async (tx) => {
      if (isActive) {
        await tx.gPDShareBySector.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      return tx.gPDShareBySector.create({
        data: { ...rest, isActive: !!isActive },
      });
    });
  }

  findAll() {
    return this.prisma.gPDShareBySector.findMany({
      orderBy: [{ year: 'desc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.gPDShareBySector.findUnique({ where: { id } });
  }

  async update(id: string, data: { 
    year?: number; 
    totalGDP?: number; 
    service?: number; 
    agriculture?: number; 
    tax?: number; 
    industry?: number; 
    isActive?: boolean 
  }) {
    const { isActive, ...rest } = data;

    return this.prisma.$transaction(async (tx) => {
      if (isActive) {
        await tx.gPDShareBySector.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      return tx.gPDShareBySector.update({
        where: { id },
        data: { ...rest, isActive: !!isActive },
      });
    });
  }

  remove(id: string) {
    return this.prisma.gPDShareBySector.delete({ where: { id } });
  }

  findActive() {
    return this.prisma.gPDShareBySector.findFirst({ where: { isActive: true } });
  }
}
