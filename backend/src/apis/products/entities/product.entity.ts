import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductCategory } from 'src/apis/products_categories/entities/product.category.entity';
import { ProductSalesLocation } from 'src/apis/products_sales_locations/entities/product.sales.location.entity';
import { ProductTag } from 'src/apis/products_tags/entities/product.tag.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column({ default: false })
  @Field(() => Boolean)
  is_sold_out: boolean;

  @JoinColumn()
  @OneToOne(() => ProductSalesLocation)
  @Field(() => ProductSalesLocation)
  product_sales_location: ProductSalesLocation;

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  product_category: ProductCategory;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinTable()
  @ManyToMany(() => ProductTag, (product_tags) => product_tags.products)
  @Field(() => [ProductTag])
  product_tags: ProductTag[];

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;

  // 소프트 삭제 시간 기록용
  @DeleteDateColumn()
  @Field(() => Date)
  deleted_at: Date;
}
