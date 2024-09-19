import { Module } from '@nestjs/common';
import { BoardsModule } from './apis/boards/boards.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './apis/products/products.module';
import { ProductsCategoriesModule } from './apis/products_categories/productsCategories.module';
import { UsersModule } from './apis/users/users.module';
import { AuthModule } from './apis/auth/auth.module';
import { PointsTransactionsModule } from './apis/points_transactions/pointsTransactions.module';
import { FilesModule } from './apis/files/files.module';

@Module({
  imports: [
    BoardsModule,
    FilesModule,
    PointsTransactionsModule,
    ProductsModule,
    ProductsCategoriesModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      // 이 방법을 이용해 context에 전달되는 req, res에 수정한 뒤 전달할 수 있음.
      // 이 방법을 적용해주어야 context를 통해 res에 접근할 수 있음.
      // () => { return {} } return문만 있는 경우
      // () => ({}) 와 같이 return을 생략할 수 있음
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule {}
