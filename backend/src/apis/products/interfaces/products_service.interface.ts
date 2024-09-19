import { CreateProductInput } from '../dto/create_product.input';
import { UpdateProductInput } from '../dto/update_product.input';
import { Product } from '../entities/product.entity';

export interface IProductsServiceCreate {
  createProductInput: CreateProductInput;
}

export interface IProductsServiceFindOne {
  productId: string;
}

export interface IProductsServiceUpdate {
  productId: string;
  updateProductInput: UpdateProductInput;
}

export interface IProductsServiceCheckSoldOut {
  product: Product;
}

export interface IProductsServiceDelete {
  productId: string;
}
