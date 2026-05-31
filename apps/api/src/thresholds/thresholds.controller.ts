import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseFilters } from '@nestjs/common';
import { ThresholdsService } from './thresholds.service';
import { CreateTheresholdDto } from './dto/create-thereshold.dto';
import { DuplicateThresholdFilter } from './filters/duplicate-threshold.filter';
import { Prisma } from '@prisma/client';

@Controller('thresholds')
@UseFilters(DuplicateThresholdFilter)
export class ThresholdsController {
    constructor(private readonly thresholdsService: ThresholdsService) { }

    @Post()
    @HttpCode(201)
    async create(@Body() body: CreateTheresholdDto) {
        return this.thresholdsService.create(body);
    }

    @Get('farm/:farmId')
    @HttpCode(200)
    async findByFarm(@Param('farmId') farmId: string) {
        return this.thresholdsService.findByFarm(farmId);
    }

    @Get(':id')
    @HttpCode(200)
    async findOne(@Param('id') id: string) {
        return this.thresholdsService.findOne(id);
    }

    @Put(':id')
    @HttpCode(200)
    async update(@Param('id') id: string, @Body() body: Prisma.ThresholdUpdateInput) {
        return this.thresholdsService.update(id, body);
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id: string) {
        this.thresholdsService.remove(id);
    }
}