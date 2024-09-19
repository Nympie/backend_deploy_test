import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductTag } from './entities/product.tag.entity';
import {
  IProductsTagsServiceBulkInsert,
  IProductsTagsServiceFindByNames,
} from './interfaces/products_tags_service.interface';

@Injectable()
export class ProductsTagsService {
  constructor(
    @InjectRepository(ProductTag)
    private readonly productsTagsRepository: Repository<ProductTag>, //
  ) {}

  findByNames({ tagNames }: IProductsTagsServiceFindByNames) {
    return this.productsTagsRepository.find({
      where: { name: In(tagNames) },
    });
  }

  bulkInsert({ names }: IProductsTagsServiceBulkInsert) {
    return this.productsTagsRepository.insert(names);
  }
}
