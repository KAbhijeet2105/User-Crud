import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LoginUserDto } from 'src/users/dtos/LoginUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { CreateUserDto } from 'src/users/dtos/createuser.dto';
import { UsersService } from 'src/users/services/users/users.service';

//set up the routes, check if any parameters passed in routes etc.

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.findUsers();
    return users;
  }

  @Get(':id')
  async getUserByid(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findUserById(id);
    return user;
  }

  @Post() //registration user
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  //login user
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.findByUsernameAndPassword(loginUserDto);
    if (user) {
      return { message: 'Login successful', user };
    } else {
      return { message: 'Login failed! Invalid credentials' };
    }
  }

  @Put()
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }
}
