import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' }) //it will create talble with namne users
export class User {
  @PrimaryGeneratedColumn({type:'bigint'}) // similar primary key in sql
  id: number;

  @Column({unique:true})
  username: string;

  @Column()
  password: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  authStrategy: string;
}
