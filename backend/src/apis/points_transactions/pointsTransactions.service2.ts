import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  POINT_TRANSACTION_STATUS,
  PointTransaction,
} from './entities/pointTransaction.entity';
import { IPointsTransactionsServiceCreate } from './interfaces/points-transactions-service.interface';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PointsTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointsTransactionsRepository: Repository<PointTransaction>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create({
    impUid,
    amount,
    user: _user,
  }: IPointsTransactionsServiceCreate): Promise<PointTransaction> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. point transaction table에 거래기록 생성
      // 등록을 위한 빈 객체 만들기
      const pointTransaction = this.pointsTransactionsRepository.create({
        // key와 value가 같으면 생략 가능
        impUid,
        amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS.PAYMENT,
      });

      // await this.pointsTransactionsRepository.save(pointTransaction);
      await queryRunner.manager.save(pointTransaction);

      // 2. user의 현재 소지 금액 가져오기
      // const user = await this.usersService.findOneById({ userId: _user.id });

      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      // 3. user의 현재 소지 금액 update
      // await this.usersService.updateAmount({
      //   userId: _user.id,
      //   amount: user.point + amount,
      // });

      const updatedUser = this.usersService.updateAmountByCreate({
        userId: user.id,
        amount: user.point + amount,
      });

      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();

      // 4. 최종결과 browser에 돌려주기
      return pointTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      // release가 없으면 commit이 끝나도 connection이 끊기지 않아 문제됨.
      // 하지만 error가 발생되면 자동으로 connection이 끊킴.
      await queryRunner.release();
    }
  }
}
