import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreateProductInput } from './dto/create_product.input';
import { Product } from './entities/product.entity';
import { UpdateProductInput } from './dto/update_product.input';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService, //
  ) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    // 브라우저에 결과를 보내주는 2가지 방법 (주로 1번 사용)
    // 1. 등록된 내용이 담긴 객체 그대로 전달
    // 2. 결과 메세지만 간단히 보내주기

    // nestjs는 이 구간에서 백엔드와 db간의 통신으로 인한 async await 처리가 자동으로 됨
    return this.productsService.create({ createProductInput });
  }

  @Query(() => Product)
  fetchProduct(
    @Args('productId') productId: string, //
  ): Promise<Product> {
    return this.productsService.findOne({ productId });
  }

  @Query(() => [Product])
  fetchProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update({ productId, updateProductInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId') productId: string, //
  ): Promise<boolean> {
    return this.productsService.delete({ productId });
  }
}
