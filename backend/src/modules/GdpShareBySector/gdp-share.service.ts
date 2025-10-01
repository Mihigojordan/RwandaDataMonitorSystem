import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GdpShareService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
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
    // Validate that sectoral shares sum to 100
    const totalShare = data.servicesShare + data.industryShare + data.agricultureShare + data.taxesShare;
    if (Math.abs(totalShare - 100) > 0.01) {
      throw new BadRequestException('Sectoral shares (Services, Industry, Agriculture, Taxes) must sum to 100%');
    }

    try {
      return await this.prisma.gdpShare.create({ data });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create GDP share record');
    }
  }

  async findAll() {
    try {
      return await this.prisma.gdpShare.findMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch GDP share records');
    }
  }

  async findOne(id: string) {
    try {
      const record = await this.prisma.gdpShare.findUnique({ where: { id } });
      if (!record) throw new NotFoundException('GDP share record not found');
      return record;
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to fetch GDP share record');
    }
  }

  async update(
    id: string,
    data: {
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
    // If updating shares, validate they sum to 100
    if (
      data.servicesShare !== undefined &&
      data.industryShare !== undefined &&
      data.agricultureShare !== undefined &&
      data.taxesShare !== undefined
    ) {
      const totalShare = data.servicesShare + data.industryShare + data.agricultureShare + data.taxesShare;
      if (Math.abs(totalShare - 100) > 0.01) {
        throw new BadRequestException('Sectoral shares (Services, Industry, Agriculture, Taxes) must sum to 100%');
      }
    }

    try {
      return await this.prisma.gdpShare.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update GDP share record');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.gdpShare.delete({ where: { id } });
      return { message: 'GDP share record deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete GDP share record');
    }
  }
}