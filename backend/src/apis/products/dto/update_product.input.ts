import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create_product.input';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {}

// 뽑기
// PickType(CreateProductInput, ['name', 'price'])

// 빼기
// OmitType(CreateProductInput, ['description'])

// 전체 nullable 처리
// PartialType(CreateProductInput)
