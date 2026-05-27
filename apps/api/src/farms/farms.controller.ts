import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { Farm } from 'src/Interfaces/farm.interface';

@Controller('farms')
export class FarmsController {

    constructor(private readonly farmsService: FarmsService) { }

    @Post()
    @HttpCode(201)
    create(@Body() body: Farm) {
        return this.farmsService.create(body);
    }

    @Get()
    @HttpCode(200)
    findAll() {
        return this.farmsService.findAll();
    }

    @Get(':id')
    @HttpCode(200)
    findOne(@Param('id') id: string) {
        return this.farmsService.findOne(id);
    }

    @Put(':id')
    @HttpCode(200)
    update(@Param('id') id: string, @Body() body: Partial<Farm>) {
        return this.farmsService.update(id, body);
    }

    @Patch(':id')
    @HttpCode(200)
    partialUpdate(@Param('id') id: string, @Body() body: Partial<Farm>) {
        return this.farmsService.update(id, body);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id: string) {
        this.farmsService.remove(id);
    }
}
