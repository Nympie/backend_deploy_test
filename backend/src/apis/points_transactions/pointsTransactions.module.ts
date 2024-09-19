import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsTransactionsResolver } from './pointsTransactions.resolver';
import { PointsTransactionsService } from './pointsTransactions.service2';
import { PointTransaction } from './entities/pointTransaction.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PointTransaction, //
    ]),
    UsersModule,
  ],
  providers: [
    PointsTransactionsResolver, //
    PointsTransactionsService,
  ],
})
export class PointsTransactionsModule {}
