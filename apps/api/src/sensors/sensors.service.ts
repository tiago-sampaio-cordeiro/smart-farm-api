import { Injectable, NotFoundException } from '@nestjs/common';
import { Sensor } from '../Interfaces/sensor.interface'

@Injectable()
export class SensorsService {
    private sensors: Sensor[] = [];

    create(sensor: Sensor) {
        this.sensors.push(sensor);
        return sensor;
    }

    findAll() {
        return this.sensors;
    }

    findByFarm(farmId: string) {
        return this.sensors.filter(sensor => sensor.farmId === farmId);
    }

    findOne(id: string) {
        const sensor = this.sensors.find((sensor) => sensor.id === id);
        if (!sensor) throw new NotFoundException('Sensor não encontrado');
        return sensor;
    }

    update(id: string, data: Partial<Sensor>) {
        const sensor = this.findOne(id);
        Object.assign(sensor, data);
        return sensor;
    }

    remove(id: string) {
        const index = this.sensors.findIndex((sensor) => sensor.id === id);
        if (index === -1) throw new NotFoundException('Sensor não encontrado');
        this.sensors.splice(index, 1);
    }
}
