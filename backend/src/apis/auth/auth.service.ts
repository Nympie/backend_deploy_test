import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  IAuthServiceCreateAccessToken,
  IAuthServiceLogin,
  IAuthServiceRestoreAccessToken,
  IAuthServiceSetRefreshToken,
} from './interfaces/auth_service.interface';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, //
    private readonly jwtService: JwtService, //
  ) {}

  createAccessToken({ userId }: IAuthServiceCreateAccessToken): string {
    return this.jwtService.sign(
      {
        sub: userId,
      },
      {
        secret: '나의비밀번호',
        expiresIn: '1h',
      },
    );
  }

  restoreAccessToken({ user }: IAuthServiceRestoreAccessToken): string {
    return this.createAccessToken({ userId: user.id });
  }

  setRefreshToken({ userId, context }: IAuthServiceSetRefreshToken): void {
    const refreshToken = this.jwtService.sign(
      {
        sub: userId,
      },
      {
        secret: '나의리프레시비밀번호',
        expiresIn: '2w',
      },
    );

    // 4-1. 개발환경 refreshToken Cookie에 담기
    context.response.setHeader(
      'set-Cookie',
      `refreshToken=${refreshToken}; path=/;`,
    );

    // 4-2. 배포환경 refreshToken Cookie에 담기 보안을 신경써야함
    // context.response.setHeader(
    //   'set-Cookie',
    //   `refreshToken=${refreshToken}; path=/; domain=.mybackendsite.com; SameSite=None; Secure; httpOnly;`,
    // );
    // context.response.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com');
  }

  async login({
    email,
    password,
    context,
  }: IAuthServiceLogin): Promise<string> {
    // 1. email이 일치하는 유저를 db에서 찾기
    const user = await this.usersService.findOneByEmail({ email });

    if (!user) {
      throw new UnprocessableEntityException('회원가입된 계정이 없습니다.');
    }

    // 2. 일치하는 유저의 password 확인
    const isAuthenticated = await bcrypt.compare(password, user.password);

    if (isAuthenticated) {
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');
    }

    // 3. refreshToken 만들기
    this.setRefreshToken({ userId: user.id, context });

    // 5. accessToken 반환
    return this.createAccessToken({ userId: user.id });
  }
}
