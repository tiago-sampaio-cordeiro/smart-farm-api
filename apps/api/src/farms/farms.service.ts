import { Injectable, NotFoundException } from '@nestjs/common';
import { Farm } from 'src/Interfaces/farm.interface';
import { FarmNotFoundException } from './exceptions/farm-not-found.exception';

@Injectable()
export class FarmsService {
    private farms: Farm[] = []

    create(farm: Farm) {
        this.farms.push(farm);
        return farm;
    }

    findAll() {
        return this.farms;
    }

    findOne(id: string) {
        const farm = this.farms.find((farm) => farm.id === id);
        if (!farm) throw new FarmNotFoundException(id);
        return farm;
    }

    update(id: string, data: Partial<Farm>) {
        const farm = this.findOne(id);
        Object.assign(farm, data);
        return farm;
    }

    remove(id: string) {
        const index = this.farms.findIndex((farm) => farm.id === id);
        if (index === -1) throw new NotFoundException('Fazenda não encontrada');
        this.farms.splice(index, 1);
    }


}
