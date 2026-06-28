import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { QueryAlertDto } from './dto/query-alert.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UseGuards } from '@nestjs/common';

@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  // metodo create só serve para testes

  // @Post()
  // @HttpCode(201)
  // async create(@Body() body: Prisma.AlertCreateInput) {
  //     return this.alertsService.create(body);
  // }

  @ApiOperation({ summary: 'Listar todos os alertas com filtro e paginação' })
  @ApiQuery({
    name: 'severity',
    required: false,
    description: 'Severidade do alerta',
  })
  @ApiQuery({ name: 'type', required: false, description: 'Tipo do alerta' })
  @ApiResponse({
    status: 200,
    description: 'Lista de alertas retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get()
  @HttpCode(200)
  async findAll(@Query() query: QueryAlertDto) {
    return this.alertsService.findAll(query.severity, query.type);
  }

  @ApiOperation({ summary: 'Buscar um alerta pelo ID' })
  @ApiResponse({ status: 200, description: 'Alerta encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Alerta não encontrado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }
}
