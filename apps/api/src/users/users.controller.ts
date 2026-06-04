import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFilterDto } from './dto/query-filter.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @HttpCode(201)
    create(@Body() body: CreateUserDto) {
        return this.usersService.create(body);
    }

    @Get('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    getAdminData() {
        return { message: 'Bem-vindo, Admin!' };
    }

    @Get()
    @UseGuards(JwtAuthGuard)
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