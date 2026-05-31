import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { QueryAlertDto } from './dto/query-alert.dto';

@Controller('alerts')
export class AlertsController {
    constructor(private readonly alertsService: AlertsService) { }

    @Get()
    @HttpCode(200)
    async findAll(@Query() query: QueryAlertDto) {
        return this.alertsService.findAll(query.severity, query.type);
    }

    @Get(':id')
    @HttpCode(200)
    async findOne(@Param('id') id: string) {
        return this.alertsService.findOne(id);
    }
}