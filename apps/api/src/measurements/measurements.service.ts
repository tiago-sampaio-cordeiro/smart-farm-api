import { Injectable, NotFoundException } from '@nestjs/common';
import { Measurement } from 'src/Interfaces/measurement.interface';
import { ThresholdExceededException } from './exceptions/threshold-exceeded.exception';
import { ThresholdsService } from 'src/thresholds/thresholds.service';

@Injectable()
export class MeasurementsService {
    private measurements: Measurement[] = [];

    create(measurement: Measurement) {
        // const threshold = this.thresholds.find(
        //     t => t.farmId === measurement.farmId && t.type === 'temperatura'
        // );

        // if (threshold && measurement.temperatura > threshold.max) {
        //     throw new ThresholdExceededException('temperatura', measurement.temperatura, threshold.max);
        // }
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
