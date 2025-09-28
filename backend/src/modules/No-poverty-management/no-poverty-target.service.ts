import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NoPovertyTargetService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    targetName: string;
    targetDescription?: string;
    targetPercentage?: number;
    source?: string;
    trend?: any;
    map?: any;
  }) {
    try {
      return await this.prisma.noPovertyTarget.create({ data });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create No Poverty target');
    }
  }

  async findAll() {
    try {
      return await this.prisma.noPovertyTarget.findMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch No Poverty targets');
    }
  }

  async findOne(id: string) {
    try {
      const record = await this.prisma.noPovertyTarget.findUnique({ where: { id } });
      if (!record) throw new NotFoundException('No Poverty target not found');
      return record;
    } catch (error) {
      console.error(error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to fetch No Poverty target');
    }
  }

  async update(
    id: string,
    data: {
      targetName?: string;
      targetDescription?: string;
      targetPercentage?: number;
      source?: string;
      trend?: any;
      map?: any;
    },
  ) {
    try {
      return await this.prisma.noPovertyTarget.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update No Poverty target');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.noPovertyTarget.delete({ where: { id } });
      return { message: 'No Poverty target deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete No Poverty target');
    }
  }
}
