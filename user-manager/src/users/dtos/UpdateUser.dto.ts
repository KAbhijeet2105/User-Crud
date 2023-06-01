import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
  }
  