import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
    constructor(private readonly alertsService: AlertsService) { }

    @Get()
    @HttpCode(200)
    findAll(
        @Query('severity') severity?: string,
        @Query('type') type?: string,
    ) {
        return this.alertsService.findAll(severity, type);
    }

    @Get(':id')
    @HttpCode(200)
    findOne(@Param('id') id: string) {
        return this.alertsService.findOne(id);
    }
}
