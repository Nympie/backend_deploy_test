import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategies/jwt_access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt_refresh.strategy';

@Module({
  imports: [
    // UserService에 있는 UserRepository에 접근하기 위함
    // TypeOrmModule.forFeature([
    //   User, //
    // ]),

    // 위의 방법으로 import를 하면 여러 service를 import해야 할 때 boilerplate가 발생
    UsersModule,
    JwtModule.register({}),
  ],
  providers: [
    // UsersService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    AuthResolver,
    AuthService,
  ],
})
export class AuthModule {}
