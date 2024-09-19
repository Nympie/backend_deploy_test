import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { ProductSalesLocationInput } from 'src/apis/products_sales_locations/dto/product_sales_location.input';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  // class-validator를 이용해 최소값을 설정해 최소값이 들어올 경우 튕겨냄.
  // 어떻게 튕겨내는지는 나중에 알아봐야할 듯.
  @Min(0)
  @Field(() => Int)
  price: number;

  @Field(() => ProductSalesLocationInput)
  productSalesLocation: ProductSalesLocationInput;

  @Field(() => String)
  productCategoryId: string;

  @Field(() => [String])
  productTags: string[];
}
