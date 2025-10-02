import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GdpGrowthBySectorAtConstantPriceService {
  constructor(private prisma: PrismaService) {}

  // Predefined sub-sectors (fixed)
  private readonly subSectors = {
    services: [
      'Trade',
      'Transportation',
      'Hotels and Restaurants',
      'Financial Services',
      'Government',
      'Health',
      'Education',
    ],
    agriculture: [
      'Livestock Products',
      'Export Crops',
      'Forestry',
      'Food Crops',
    ],
    industry: [
      'Chemical and Plastic Products',
      'Construction',
      'Food Manufacture',
      'Textile & Clothing',
    ],
  };

  async create(data: {
    totalGdp: number;
    servicesShare: number;
    industryShare: number;
    agricultureShare: number;
    taxesShare: number;
    // Optional detailed breakdown of sub-sector percentages
    servicesSubShares?: Record<string, number>;
    agricultureSubShares?: Record<string, number>;
    industrySubShares?: Record<string, number>;
  }) {
    // Validate main sector shares sum = 100
    const totalShare =
      data.servicesShare +
      data.industryShare +
      data.agricultureShare +
      data.taxesShare;

    if (Math.abs(totalShare - 100) > 0.01) {
      throw new BadRequestException(
        'Sectoral shares (Services, Industry, Agriculture, Taxes) must sum to 100%',
      );
    }

    console.log(data);
    
    
    this.validateSubSectors('services', data.servicesSubShares);
    this.validateSubSectors('agriculture', data.agricultureSubShares, false);
    this.validateSubSectors('industry', data.industrySubShares, false);

    try {
      return await this.prisma.gdpGrowthBySectorAtConstantPrice.create({
        data: {
          totalGdp: data.totalGdp,
          servicesShare: data.servicesShare,
          industryShare: data.industryShare,
          agricultureShare: data.agricultureShare,
          taxesShare: data.taxesShare,
          servicesSubShares: data.servicesSubShares || {},
          agricultureSubShares: data.agricultureSubShares || {},
          industrySubShares:data.industrySubShares || {},
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to create GDP growth record',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.gdpGrowthBySectorAtConstantPrice.findMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to fetch GDP growth records',
      );
    }
  }

  async findOne(id: string) {
    try {
      const record =
        await this.prisma.gdpGrowthBySectorAtConstantPrice.findUnique({
          where: { id },
        });
      if (!record) throw new NotFoundException('GDP growth record not found');
      return record;
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(
            'Failed to fetch GDP growth record',
          );
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
      servicesSubShares?: Record<string, number>;
    },
  ) {
    // Validate main shares if provided
    if (
      data.servicesShare !== undefined &&
      data.industryShare !== undefined &&
      data.agricultureShare !== undefined &&
      data.taxesShare !== undefined
    ) {
      const totalShare =
        data.servicesShare +
        data.industryShare +
        data.agricultureShare +
        data.taxesShare;

      if (Math.abs(totalShare - 100) > 0.01) {
        throw new BadRequestException(
          'Sectoral shares (Services, Industry, Agriculture, Taxes) must sum to 100%',
        );
      }
    }

    if (data.servicesSubShares) {
      this.validateSubSectors('services', data.servicesSubShares);
    }


    try {
      return await this.prisma.gdpGrowthBySectorAtConstantPrice.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to update GDP growth record',
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.gdpGrowthBySectorAtConstantPrice.delete({
        where: { id },
      });
      return { message: 'GDP growth record deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to delete GDP growth record',
      );
    }
  }

  // Helper: Validate sub-sectors
  private validateSubSectors(
    sector: keyof typeof this.subSectors,
    subShares?: Record<string, number>,
    allowChange = true,
  ) {
    if (!subShares && allowChange) {
      throw new BadRequestException(
        `${sector} sub-sectors percentages are required`,
      );
    }

    if (subShares) {
      const invalid = Object.keys(subShares).filter(
        (key) => !this.subSectors[sector].includes(key),
      );
      if (invalid.length > 0) {
        throw new BadRequestException(
          `Invalid ${sector} sub-sectors: ${invalid.join(', ')}`,
        );
      }
    }
  }

  // Helper: Map fixed sub-sector shares (default 0 or static values)
  private mapFixedSubShares(sector: keyof typeof this.subSectors) {
    const obj: Record<string, number> = {};
    this.subSectors[sector].forEach((s) => (obj[s] = 0));
    return obj;
  }
}
