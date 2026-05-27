import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/Interfaces/user.interface';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @HttpCode(201)
    create(@Body() body: User) {
        return this.usersService.create(body);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: Partial<User>) {
        return this.usersService.update(id, body);
    }

    @Patch(':id')
    partialUpdate(@Param('id') id: string, @Body() body: Partial<User>) {
        return this.usersService.update(id, body);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id: string) {
        this.usersService.remove(id);
    }
}
