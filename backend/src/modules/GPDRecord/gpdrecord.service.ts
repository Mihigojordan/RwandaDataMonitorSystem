import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Quarter } from 'generated/prisma';

@Injectable()
export class GPDRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { 
    year: number; 
    quarter: Quarter; 
    amountBillionRwf: number; 
    isActive?: boolean 
  }) {
    const { isActive, ...rest } = data;

    return this.prisma.$transaction(async (tx) => {
      if (isActive) {
        await tx.gPDRecord.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      return tx.gPDRecord.create({
        data: { ...rest, isActive: !!isActive },
      });
    });
  }

  findAll() {
    return this.prisma.gPDRecord.findMany({
      orderBy: [
        { year: 'desc' },
        { quarter: 'desc' }
      ],
    });
  }

  findOne(id: string) {
    return this.prisma.gPDRecord.findUnique({ where: { id } });
  }

  async update(id: string, data: { 
    year?: number; 
    quarter?: Quarter; 
    amountBillionRwf?: number; 
    isActive?: boolean 
  }) {
    const { isActive, ...rest } = data;

    return this.prisma.$transaction(async (tx) => {
      if (isActive) {
        await tx.gPDRecord.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
      }

      return tx.gPDRecord.update({
        where: { id },
        data: { ...rest, isActive: !!isActive },
      });
    });
  }

  remove(id: string) {
    return this.prisma.gPDRecord.delete({ where: { id } });
  }

  findActive() {
    return this.prisma.gPDRecord.findFirst({ where: { isActive: true } });
  }
}
