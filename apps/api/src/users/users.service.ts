import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/Interfaces/user.interface';

@Injectable()
export class UsersService {

    private users: User[] = [];

    create(user: User) {
        this.users.push(user);
        return user;
    }

    findAll() {
        return this.users;
    }

    findOne(id: string) {
        const user = this.users.find((user) => user.id === id);
        if (!user) throw new NotFoundException('Usuário não encontrado');
        return user;
    }

    update(id: string, data: Partial<User>) {
        const user = this.findOne(id);
        Object.assign(user, data);
        return user;
    }

    remove(id: string) {
        const index = this.users.findIndex((user) => user.id === id);
        if (index === -1) throw new NotFoundException('Usuario não encontrado');
        this.users.splice(index, 1);
    }
}
