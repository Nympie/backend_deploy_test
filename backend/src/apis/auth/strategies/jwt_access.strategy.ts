import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  // 만료시간, 비밀번호 검증 진행
  // 실패 시 throw error, 성공 시 validate 함수 실행
  constructor() {
    super({
      //   jwtFromRequest: (request) => {
      //     const temp = request.headers.Authroization;
      //     const accessToken = temp.toLowercase().replace('bearer ', '');
      //     return accessToken;
      //   },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      // 비밀번호
      secretOrKey: '나의비밀번호',
    });
  }

  validate(payload) {
    // request.user.id가 생기게 됨
    return {
      id: payload.sub,
    };
  }
}
