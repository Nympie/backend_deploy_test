import { InputType, OmitType } from '@nestjs/graphql';
import { ProductSalesLocation } from '../entities/product_sales_location.entity';

export class ProductSalesLocationInput extends OmitType(
  ProductSalesLocation,
  ['id'],
  InputType,
) {}
