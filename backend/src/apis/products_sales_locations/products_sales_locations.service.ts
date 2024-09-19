import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductSalesLocation } from './entities/product_sales_location.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsSalesLocationsService {
  constructor(
    @InjectRepository(ProductSalesLocation)
    private readonly productsSalesLocationsRepository: Repository<ProductSalesLocation>, //
  ) {}

  create({ productSalesLocation }) {
    return this.productsSalesLocationsRepository.save({
      ...productSalesLocation,
    });
  }
}
