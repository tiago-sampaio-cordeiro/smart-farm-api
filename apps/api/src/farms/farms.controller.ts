import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { FarmNotFoundFilter } from './filters/farm-not-found.filter';
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
import { Prisma } from '@prisma/client';

@ApiTags('farms')
@Controller('farms')
@UseFilters(FarmNotFoundFilter)
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @ApiBody({ type: CreateFarmDto })
  @ApiOperation({ summary: 'Criar uma nova plantação' })
  @ApiResponse({ status: 201, description: 'Plantação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateFarmDto) {
    return this.farmsService.create(body);
  }

  @ApiOperation({ summary: 'Listar todas as plantações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de plantações retornada com sucesso',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.farmsService.findAll();
  }

  @ApiOperation({ summary: 'Buscar uma plantação pelo cuid()' })
  @ApiResponse({ status: 200, description: 'Plantação encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Plantação não encontrada' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.farmsService.findOne(id);
  }

  @ApiBody({ type: CreateFarmDto })
  @ApiOperation({
    summary: 'Atualizar completamente uma plantação pelo cuid()',
  })
  @ApiResponse({ status: 200, description: 'Plantação atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Plantação não encontrada' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() body: Prisma.FarmUpdateInput) {
    return this.farmsService.update(id, body);
  }

  @ApiBody({ type: CreateFarmDto })
  @ApiOperation({ summary: 'Atualizar parcialmente uma plantação pelo cuid()' })
  @ApiResponse({
    status: 200,
    description: 'Plantação atualizada parcialmente com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Plantação não encontrada' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  partialUpdate(@Param('id') id: string, @Body() body: Prisma.FarmUpdateInput) {
    return this.farmsService.update(id, body);
  }

  @ApiOperation({ summary: 'Remover uma plantação pelo cuid()' })
  @ApiResponse({ status: 204, description: 'Plantação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Plantação não encontrada' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.farmsService.remove(id);
  }
}
