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
    summary: 'Listar todas as medições, com filtro opcional por sensorId',
  })
  @ApiQuery({
    name: 'sensorId',
    required: false,
    description: 'Ids dos sensores para filtrar as medições',
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
  findAll(@Query('sensorId') sensorId?: string) {
    return this.measurementsService.findAll(sensorId);
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
