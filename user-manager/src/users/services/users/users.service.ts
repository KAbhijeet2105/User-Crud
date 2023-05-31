import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; //repository helps to map ts class to sql table columns
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/entities/User';

import {
  CreateUserParams,
  LoginUserParams,
  UpdateUserParams,
} from 'src/utils/types';
import { comparePasswords, hashPassword } from 'src/utils/bcrypt.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findUsers() {
    return this.userRepository.find();
  }

  async createUser(userDetails: CreateUserParams) {
    const hashedPassword = await hashPassword(userDetails.password);
    userDetails.password = hashedPassword;

    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });

    return this.userRepository.save(newUser); //return promise// its an async method
  }

  async updateUser(id: number, updateUserDetails: UpdateUserParams) {

   
    const hashedPassword = await hashPassword(updateUserDetails.password);
    updateUserDetails.password = hashedPassword;
    
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  findUserById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  /*
  findByUsernameAndPassword(loginUserDetails: LoginUserParams) {
    
    const usr = this.findByUsername(loginUserDetails.username);

    const res = comparePasswords(loginUserDetails.password,  (await usr).password );

    return this.userRepository.findOne({ where: { ...loginUserDetails } });
  }
*/

  async findByUsernameAndPassword(loginUserDetails: LoginUserParams) {
    const user = await this.userRepository.findOne({
      where: { username: loginUserDetails.username },
    });
    /*if (!user) {
      throw new Error('Invalid username');
    }*/

    const isMatch = await comparePasswords(
      loginUserDetails.password,
      user.password,
    );
    /* if (!isMatch) {
      throw new Error('Invalid password');
    }
    */

    return user;
  }
}
