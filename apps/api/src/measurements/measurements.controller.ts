import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { Measurement } from 'src/Interfaces/measurement.interface';
import { CreateMeasurementDto } from './dto/create-measurement.dto';

@Controller('measurements')
export class MeasurementsController {
    constructor(private readonly measurementsService: MeasurementsService) { }

    @Post()
    @HttpCode(201)
    create(@Body() body: CreateMeasurementDto) {
        return this.measurementsService.create(body as Measurement);
    }

    @Get()
    @HttpCode(200)
    findAll(@Query('sensorId') sensorId?: string) {
        return this.measurementsService.findAll(sensorId);
    }

    @Get(':id')
    @HttpCode(200)
    findOne(@Param('id') id: string) {
        return this.measurementsService.findOne(id);
    }
}
