import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ThresholdsService } from './thresholds.service';
import { CreateTheresholdDto } from './dto/create-thereshold.dto';
import { DuplicateThresholdFilter } from './filters/duplicate-threshold.filter';
import { Prisma } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('thresholds')
@Controller('thresholds')
@UseFilters(DuplicateThresholdFilter)
export class ThresholdsController {
  constructor(private readonly thresholdsService: ThresholdsService) { }

  @ApiOperation({ summary: 'Criar um novo conjunto de parâmetros' })
  @ApiBody({ type: CreateTheresholdDto })
  @ApiResponse({ status: 201, description: 'parâmetros criados com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post()
  @HttpCode(201)
  create(@Body() body: CreateTheresholdDto) {
    return this.thresholdsService.create(body);
  }

  @ApiOperation({ summary: 'Listar todos os parâmetros de uma plantação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de parâmetros retornada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Parâmetros não encontrados' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('farm/:farmId')
  @HttpCode(200)
  findByFarm(@Param('farmId') farmId: string) {
    return this.thresholdsService.findByFarm(farmId);
  }

  @ApiOperation({ summary: 'Buscar um parâmetro pelo Id' })
  @ApiResponse({
    status: 200,
    description: 'Parâmetros encontrados com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Parâmetros não encontrados' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.thresholdsService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar um parâmetro pelo Id' })
  @ApiBody({ type: CreateTheresholdDto })
  @ApiResponse({
    status: 200,
    description: 'Parâmetros atualizados com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Parâmetros não encontrados' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Put(':id')
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @Body() body: Prisma.ThresholdUpdateInput,
  ) {
    return this.thresholdsService.update(id, body);
  }

  @ApiOperation({ summary: 'Atualizar um parâmetro pelo Id' })
  @ApiBody({ type: CreateTheresholdDto })
  @ApiResponse({
    status: 200,
    description: 'Parâmetros atualizados com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Parâmetros não encontrados' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Patch(':id')
  @HttpCode(200)
  updatePartial(
    @Param('id') id: string,
    @Body() body: Prisma.ThresholdUpdateInput,
  ) {
    return this.thresholdsService.update(id, body);
  }

  @ApiOperation({ summary: 'Remover um parâmetro pelo Id' })
  @ApiResponse({ status: 204, description: 'Parâmetros removidos com sucesso' })
  @ApiResponse({ status: 404, description: 'Parâmetros não encontrados' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    this.thresholdsService.remove(id);
  }
}
