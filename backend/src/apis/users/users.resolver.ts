import { Resolver, Args, Int, Mutation, Query, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql_auth.guard';
import { IContext } from '../../commons/interfaces/context';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  // rest-api 인가 방식
  @UseGuards(GqlAuthGuard({ name: 'access' }))
  @Query(() => String)
  fetchUser(
    @Context() context: IContext, //
  ): string {
    // context.request.user.id;

    return '인가에 성공하셨습니다.';
  }

  @Mutation(() => User)
  createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args({ name: 'age', type: () => Int }) age: number,
  ): Promise<User> {
    return this.usersService.create({ email, password, name, age });
  }
}
