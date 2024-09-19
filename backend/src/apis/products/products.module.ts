import { Module } from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsSalesLocationsService } from '../products_sales_locations/products_sales_locations.service';
import { ProductSalesLocation } from '../products_sales_locations/entities/product_sales_location.entity';
import { ProductsTagsService } from '../products_tags/products_tags.service';
import { ProductTag } from '../products_tags/entities/product.tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, //
      ProductSalesLocation,
      ProductTag,
    ]),
  ],
  providers: [
    ProductsResolver,
    ProductsService,
    ProductsSalesLocationsService,
    ProductsTagsService,
  ],
})
export class ProductsModule {}
