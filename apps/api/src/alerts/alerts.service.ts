import { Injectable, NotFoundException } from '@nestjs/common';
import { Alert } from 'src/Interfaces/alert.interface';

@Injectable()
export class AlertsService {
    private alerts: Alert[] = [];

    create(alert: Alert) {
        this.alerts.push(alert);
        return alert;
    }

    findAll(severity?: string, type?: string) {
        return this.alerts.filter(alert => {
            if (severity && alert.severity !== severity) return false;
            if (type && alert.type !== type) return false;
            return true;
        });
    }

    findOne(id: string) {
        const alert = this.alerts.find(alert => alert.id === id);
        if (!alert) throw new NotFoundException('Alerta não encontrado');
        return alert;
    }
}
