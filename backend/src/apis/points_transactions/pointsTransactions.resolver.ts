import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { PointTransaction } from './entities/pointTransaction.entity';
import { PointsTransactionsService } from './pointsTransactions.service2';
import { GqlAuthGuard } from '../auth/guards/gql_auth.guard';
import { IContext } from 'src/commons/interfaces/context';

@Resolver()
export class PointsTransactionsResolver {
  constructor(
    private readonly pointsTransactionsService: PointsTransactionsService,
  ) {}

  @UseGuards(GqlAuthGuard({ name: 'access' }))
  @Mutation(() => PointTransaction)
  createPointTransaction(
    @Args('impUid') impUid: string, //
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Context() context: IContext,
  ): Promise<PointTransaction> {
    const user = context.request.user;
    return this.pointsTransactionsService.create({ impUid, amount, user });
  }
}
