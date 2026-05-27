import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { Sensor } from 'src/Interfaces/sensor.interface';

@Controller('farms/:farmId/sensors')
export class SensorsController {
    constructor(private readonly sensorsService: SensorsService) { }

    @Post()
    @HttpCode(201)
    create(@Param('farmId') farmId: string, @Body() body: Sensor) {
        return this.sensorsService.create({ ...body, farmId });
    }

    @Get()
    @HttpCode(200)
    findAll(@Param('farmId') farmId: string) {
        return this.sensorsService.findByFarm(farmId);
    }

    @Get(':id')
    @HttpCode(200)
    findOne(@Param('id') id: string) {
        return this.sensorsService.findOne(id);
    }

    @Put(':id')
    @HttpCode(200)
    update(@Param('id') id: string, @Body() body: Partial<Sensor>) {
        return this.sensorsService.update(id, body);
    }

    @Patch(':id')
    @HttpCode(200)
    partialUpdate(@Param('id') id: string, @Body() body: Partial<Sensor>) {
        return this.sensorsService.update(id, body);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id: string) {
        this.sensorsService.remove(id);
    }
}
