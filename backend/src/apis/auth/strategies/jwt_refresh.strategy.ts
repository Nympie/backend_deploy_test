import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  // 만료시간, 비밀번호 검증 진행
  // 실패 시 throw error, 성공 시 validate 함수 실행
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: '나의리프레쉬비밀번호',
    });
  }

  validate(payload) {
    // request.user.id가 생기게 됨
    return {
      id: payload.sub,
    };
  }
}
