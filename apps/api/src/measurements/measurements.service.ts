import { Injectable, NotFoundException } from '@nestjs/common';
import { Measurement } from 'src/Interfaces/measurement.interface';

@Injectable()
export class MeasurementsService {
    private measurements: Measurement[] = [];

    create(measurement: Measurement) {
        this.measurements.push(measurement);
        return measurement;
    }

    findAll(sensorId?: string) {
        if (sensorId) {
            return this.measurements.filter(m => m.sensorId === sensorId);
        }
        return this.measurements;
    }

    findOne(id: string) {
        const measurement = this.measurements.find(m => m.id === id);
        if (!measurement) throw new NotFoundException('Medição não encontrada');
        return measurement;
    }
}
