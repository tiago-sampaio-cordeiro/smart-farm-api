import { Injectable, NotFoundException } from '@nestjs/common';
import { Threshold } from 'src/Interfaces/threshold.interface';

@Injectable()
export class ThresholdsService {
    private thresholds: Threshold[] = [];

    create(threshold: Threshold) {
        this.thresholds.push(threshold);
        return threshold;
    }

    findByFarm(farmId: string) {
        return this.thresholds.filter(t => t.farmId === farmId);
    }

    findOne(id: string) {
        const threshold = this.thresholds.find(t => t.id === id);
        if (!threshold) throw new NotFoundException('Threshold não encontrado');
        return threshold;
    }

    update(id: string, updateData: Partial<Threshold>) {
        const threshold = this.findOne(id);
        Object.assign(threshold, updateData);
        return threshold;
    }

    remove(id: string) {
        const index = this.thresholds.findIndex(t => t.id === id);
        if (index === -1) throw new NotFoundException('Threshold não encontrado');
        this.thresholds.splice(index, 1);
    }
}
