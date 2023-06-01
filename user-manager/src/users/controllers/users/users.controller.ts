import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginUserDto } from 'src/users/dtos/LoginUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { CreateUserDto } from 'src/users/dtos/createuser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { Request, Response } from 'express';

//set up the routes, check if any parameters passed in routes etc.

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.userService.findUsers();
    users.forEach(
      (user) => {
        delete user.password;
      },
      (err) => {},
    );
    return users;
  }

  //get user by id
  @Get(':id')
  async getUserByid(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findUserById(id);
    if (!user) return { message: 'Error user not found!' };

    delete user.password; //test
    return user;
  }

  @Post() //registration user
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto,
  @Req() req: Request,
  @Res() res: Response,
  ) {
    const user = this.userService.createUser(createUserDto);
   
    if (user) {
        res.status(201).send({ message: 'User created successfully!' });
      } else {
        res.status(400).send({ message: 'User creation failed! ' });
      }
  }

  //login user
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.userService.findByUsernameAndPassword(loginUserDto);
    //const user = await this.userService. findByUsername(loginUserDto.username);

    if (user) {
        delete user.password;
      res.status(201).send({ message: 'Login successfull', user });
    } else {
      res.status(400).send({ message: 'Login failed! Please check your login credentials !' });
    }
  }

  //update user credentials
  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const usr = await this.userService.updateUser(id, updateUserDto);

    if (usr) {
        res.status(201).send({ message: 'User updated successfully'});
      } else {
        res.status(400).send({ message: 'Update failed! ' });
      }

    //return usr;
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }
}
