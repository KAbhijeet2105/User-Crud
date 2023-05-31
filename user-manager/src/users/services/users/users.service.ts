import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; //repository helps to map ts class to sql table columns
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/entities/User';
import {
  CreateUserParams,
  LoginUserParams,
  UpdateUserParams,
} from 'src/utils/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findUsers() {
    return this.userRepository.find();
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });

    return this.userRepository.save(newUser); //return promise// its an async method
  }

  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  findUserById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findByUsernameAndPassword(loginUserDetails: LoginUserParams) {
    return this.userRepository.findOne({ where: { ...loginUserDetails } });
  }
}
