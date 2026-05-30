import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseFilters } from '@nestjs/common';
import { Threshold } from 'src/Interfaces/threshold.interface';
import { ThresholdsService } from './thresholds.service';
import { CreateTheresholdDto } from './dto/create-thereshold.dto';
import { DuplicateThresholdFilter } from './filters/duplicate-threshold.filter';

@Controller('thresholds')
@UseFilters(DuplicateThresholdFilter)
export class ThresholdsController {
    constructor(private readonly thresholdsService: ThresholdsService) { }

    @Post()
    @HttpCode(201)
    create(@Body() body: CreateTheresholdDto) {
        return this.thresholdsService.create(body as Threshold);
    }

    @Get('farm/:farmId')
    @HttpCode(200)
    findByFarm(@Param('farmId') farmId: string) {
        return this.thresholdsService.findByFarm(farmId);
    }

    @Get(':id')
    @HttpCode(200)
    findOne(@Param('id') id: string) {
        return this.thresholdsService.findOne(id);
    }

    @Put(':id')
    @HttpCode(200)
    update(@Param('id') id: string, @Body() body: Partial<Threshold>) {
        return this.thresholdsService.update(id, body);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id: string) {
        this.thresholdsService.remove(id);
    }
}
