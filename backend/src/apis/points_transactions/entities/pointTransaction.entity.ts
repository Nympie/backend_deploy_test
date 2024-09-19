import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum POINT_TRANSACTION_STATUS {
  PAYMENT = '결제완료',
  CANCEL = '취소완료',
}

registerEnumType(POINT_TRANSACTION_STATUS, {
  name: 'POINT_TRANSACTION_STATUS',
});

// insert only table
// 결제는 민감한 사항이기 때문에 수정 불가
@Entity()
@ObjectType()
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @Column()
  @Field(() => Int)
  amount: number;

  @Column({ type: 'enum', enum: POINT_TRANSACTION_STATUS })
  @Field(() => POINT_TRANSACTION_STATUS)
  status: POINT_TRANSACTION_STATUS;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
