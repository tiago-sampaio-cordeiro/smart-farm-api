import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { SensorInactiveFilter } from './filters/sensor-inactive.filter';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('sensors')
@Controller('farms/:farmId/sensors')
@UseFilters(SensorInactiveFilter)
export class SensorsController {
    constructor(private readonly sensorsService: SensorsService) { }

    @ApiBody({ type: CreateSensorDto })
    @ApiOperation({ summary: 'Criar um novo sensor para uma plantação' })
    @ApiResponse({ status: 201, description: 'Sensor criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Plantação não encontrada' })
    @ApiBearerAuth()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    async create(@Param('farmId') farmId: string, @Body() body: CreateSensorDto) {
        return this.sensorsService.create({ ...body, farmId });
    }

    @ApiOperation({ summary: 'Listar todos os sensores de uma plantação' })
    @ApiResponse({ status: 200, description: 'Lista de sensores retornada com sucesso' })
    @ApiResponse({ status: 404, description: 'Plantação não encontrada' })
    @ApiBearerAuth()
    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    async findAll(@Param('farmId') farmId: string) {
        return this.sensorsService.findByFarm(farmId);
    }

    @ApiOperation({ summary: 'Buscar um sensor pelo ID' })
    @ApiResponse({ status: 200, description: 'Sensor encontrado com sucesso' })
    @ApiResponse({ status: 404, description: 'Sensor não encontrado' })
    @ApiBearerAuth()
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    async findOne(@Param('id') id: string) {
        return this.sensorsService.findOne(id);
    }

    @ApiBody({ type: UpdateSensorDto })
    @ApiOperation({ summary: 'Atualizar completamente um sensor pelo ID' })
    @ApiResponse({ status: 200, description: 'Sensor atualizado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Sensor não encontrado' })
    @ApiBearerAuth()
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    async update(@Param('id') id: string, @Body() body: UpdateSensorDto) {
        return this.sensorsService.update(id, body);
    }

    @ApiBody({ type: UpdateSensorDto })
    @ApiOperation({ summary: 'Atualizar parcialmente um sensor pelo ID' })
    @ApiResponse({ status: 200, description: 'Sensor atualizado parcialmente com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Sensor não encontrado' })
    @ApiBearerAuth()
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    async partialUpdate(@Param('id') id: string, @Body() body: Partial<UpdateSensorDto>) {
        return this.sensorsService.update(id, body);
    }

    @ApiOperation({ summary: 'Remover um sensor pelo ID' })
    @ApiResponse({ status: 204, description: 'Sensor removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Sensor não encontrado' })
    @ApiBearerAuth()
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    async remove(@Param('id') id: string) {
        this.sensorsService.remove(id);
    }
}