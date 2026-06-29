import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { ThresholdExceededFilter } from './filters/threshold-exceeded.filter';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('measurements')
@Controller('measurements')
@UseFilters(ThresholdExceededFilter)
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @ApiBody({ type: CreateMeasurementDto })
  @ApiOperation({ summary: 'Registrar uma nova medição' })
  @ApiResponse({ status: 201, description: 'Medição registrada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  create(@Body() body: CreateMeasurementDto) {
    return this.measurementsService.create(body);
  }

  @ApiOperation({
    summary:
      'Listar medições com filtro opcional por sensor, lavoura e período',
  })
  @ApiQuery({
    name: 'sensorId',
    required: false,
    description: 'ID do sensor para filtrar as medições',
  })
  @ApiQuery({
    name: 'farmId',
    required: false,
    description: 'ID da lavoura para filtrar as medições',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'Data inicial do período (ISO 8601), ex: 2026-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'Data final do período (ISO 8601), ex: 2026-12-31T23:59:59Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de medições retornada com sucesso',
  })
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  findAll(
    @Query('sensorId') sensorId?: string,
    @Query('farmId') farmId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.measurementsService.findAll(sensorId, farmId, from, to);
  }

  @ApiOperation({ summary: 'Buscar uma medição pelo Id do sensor' })
  @ApiResponse({ status: 200, description: 'Medição encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Medição não encontrada' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  findOne(@Param('id') id: string) {
    return this.measurementsService.findOne(id);
  }
}
