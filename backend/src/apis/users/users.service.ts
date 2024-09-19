import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IUsersServiceCreate,
  IUsersServiceFindOneByEmail,
  IUsersServiceFindOneById,
  IUsersServiceUpdateAmount,
} from './interfaces/users_serivce.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, //
  ) {}

  findOneById({ userId }: IUsersServiceFindOneById): Promise<User> {
    return this.usersRepository.findOne({
      where: { id: userId },
    });
  }

  findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  updateAmount({ userId, amount }: IUsersServiceUpdateAmount): void {
    this.usersRepository.update({ id: userId }, { point: amount });
  }

  updateAmountByCreate({ userId, amount }: IUsersServiceUpdateAmount): User {
    return this.usersRepository.create({
      id: userId,
      point: amount,
    });
  }

  async create({
    email,
    password,
    name,
    age,
  }: IUsersServiceCreate): Promise<User> {
    // 이메일 중복확인
    const user = await this.findOneByEmail({ email });

    if (user) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    // 단방향 암호화 Hash
    // 레인보우 테이블과 brute force attack을 막기 위해 salt를 더해 hash
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.usersRepository.save({
      email: email,
      password: hashedPassword,
      name: name,
      age: age,
    });
  }
}
