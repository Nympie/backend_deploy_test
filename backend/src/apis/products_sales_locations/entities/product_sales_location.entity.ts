import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductSalesLocation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column()
  @Field(() => String)
  address_detail: string;

  // 9자리 중 6자리 소숫점
  @Column({ type: 'decimal', precision: 9, scale: 6 })
  @Field(() => Float)
  lat: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  @Field(() => Float)
  lng: number;

  @Column()
  @Field(() => Date)
  meeting_time: Date;
}
