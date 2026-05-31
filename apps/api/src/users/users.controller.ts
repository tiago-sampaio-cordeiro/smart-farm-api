import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFilterDto } from './dto/query-filter.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @HttpCode(201)
    create(@Body() body: CreateUserDto) {
        return this.usersService.create(body);
    }

    @Get()
    findAll(@Query() query: QueryFilterDto) {
        return this.usersService.findAll(query.filter, query.page);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: CreateUserDto) {
        return this.usersService.update(id, body);
    }

    @Patch(':id')
    partialUpdate(@Param('id') id: string, @Body() body: Partial<CreateUserDto>) {
        return this.usersService.update(id, body);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id: string): void {
        this.usersService.remove(id);
    }
}