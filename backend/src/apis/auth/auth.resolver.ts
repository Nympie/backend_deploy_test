import { Resolver, Args, Mutation, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { IContext } from 'src/commons/interfaces/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql_auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  @Mutation(() => String)
  login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ): Promise<string> {
    return this.authService.login({ email, password, context });
  }

  // 1. refreshToken 인가
  @UseGuards(GqlAuthGuard({ name: 'refresh' }))
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ): string {
    // 2. accessToken 재발급
    return this.authService.restoreAccessToken({ user: context.request.user });
  }
}
