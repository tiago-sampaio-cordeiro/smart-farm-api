import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseFilters } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { Farm } from 'src/Interfaces/farm.interface';
import { CreateFarmDto } from './dto/create-farm.dto';
import { FarmNotFoundFilter } from './filters/farm-not-found.filter';

@Controller('farms')
@UseFilters(FarmNotFoundFilter)
export class FarmsController {

    constructor(private readonly farmsService: FarmsService) { }

    @Post()
    @HttpCode(201)
    create(@Body() body: CreateFarmDto) {
        return this.farmsService.create(body as Farm);
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
