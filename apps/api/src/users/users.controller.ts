import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/Interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFilterDto } from './dto/query-filter.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @HttpCode(201)
    create(@Body() body: CreateUserDto) {
        return this.usersService.create(body as User);
    }

    @Get()
    findAll(@Query() query: QueryFilterDto) {
        return this.usersService.findAll(query.filter, query.page);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(String(id));
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

// import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { User } from 'src/interfaces/user.interface';
// import { CreateUserDto } from './dto/create-user.dto';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) { }

//   @Post()
//   @HttpCode(201)
//   create(@Body() body: CreateUserDto) {
//     return this.usersService.create(body as User);
//   }

//   @Get()
//   findAll() {
//     return this.usersService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.usersService.findOne(id);
//   }

//   @Put(':id')
//   update(@Param('id') id: string, @Body() body: Partial<User>) {
//     return this.usersService.update(id, body);
//   }

//   @Patch(':id')
//   partialUpdate(@Param('id') id: string, @Body() body: Partial<User>) {
//     return this.usersService.update(id, body);
//   }

//   @Delete(':id')
//   @HttpCode(204)
//   remove(@Param('id') id: string): void {
//     this.usersService.remove(id);
//   }
// }

