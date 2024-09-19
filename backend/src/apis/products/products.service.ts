import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IProductsServiceCheckSoldOut,
  IProductsServiceCreate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
  IProductsServiceUpdate,
} from './interfaces/products_service.interface';
import { ProductsSalesLocationsService } from '../products_sales_locations/products_sales_locations.service';
import { ProductsTagsService } from '../products_tags/products_tags.service';

// @Injectable({scope: Scope.REQUEST})
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, //
    private readonly productsSalesLocationsService: ProductsSalesLocationsService, //
    private readonly productsTagsService: ProductsTagsService, //
  ) {}

  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    // 1. 상품 하나만 등록할 때 사용하는 방법
    // const result = this.productsRepository.save({
    // ...createProductInput,
    // });

    // 2. 상품과 상품 거래 위치를 같이 등록하는 방법
    const { productSalesLocation, productCategoryId, productTags, ...product } =
      createProductInput;

    // 서비스를 이용하는 이유: repository에 접근 방법을 일원화하기 위함
    // repository 접근 방법이 일원화되면 검증 로직 재사용 가능
    const locationResult = await this.productsSalesLocationsService.create({
      productSalesLocation,
    });

    const tagNames = productTags.map((el) => el.replace('#', ''));
    const prevTags = await this.productsTagsService.findByNames({ tagNames });
    const temp = [];

    tagNames.forEach((el) => {
      const isExist = prevTags.find((prevEl) => el === prevEl.name);
      if (!isExist) {
        temp.push({ name: el });
      }
    });

    // bulk-insert
    const tagResult = await this.productsTagsService.bulkInsert({
      names: temp,
    });
    const tags = [...prevTags, ...tagResult.identifiers];

    const result = this.productsRepository.save({
      ...product,
      productSalesLocation: locationResult,
      productCategory: {
        id: productCategoryId,
        // name까지 같이 받고 싶은 경우 front_end에서 name과 같이 넣어주기
        // 아니면 귀찮지만 백엔드에서 한번 더 확인하기
        // front_end에서 category_list를 가지고 있는게 좋음
        // 이 경우 관리하는 category_list에 없는 새로운 id가 중간에 생겼을 때 오류가 날 수 있음
        // 이를 처리하려면 오류가 날 경우 category_list를 최신화하는 로직을 작성하면 될 듯
      },
      productTags: tags,
    });
    return result;
  }

  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      // 테이블을 조인해서 값을 같이 가져오는 경우
      relations: ['productSalesLocation'],
    });
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['productSalesLocation'],
    });
  }

  async update({
    productId,
    updateProductInput,
  }: IProductsServiceUpdate): Promise<Product> {
    // save 명령어는 등록과 수정으로 사용할 수 있음
    // 다른 명령어는 result를 받아오지 않지만 save 명령어는 db에 등록하고 result를 받아올 수 있음
    // 변경된 내용을 화면에 보여줘야 하는가에 따라 사용하면 좋음
    // 다만 result에 담기는 값은 save 명령어를 통해 넘겨지는 변수들이기 때문에 다른 값들도 받으려면 다 넘겨줘야함

    // const product = await this.productsRepository.findOne({
    // where: { id: productId },
    // });

    // findOne을 수행하기 전에 진행하는 검증 코드가 있는 경우 이를 재사용하기 위함
    const product = await this.findOne({ productId });

    // http 상태 코드를 보고 맞춰주는 것이 개발이 원활하게 진행됨
    // if (product.is_sold_out) {
    // throw new HttpException(
    // '이미 판매 완료된 상품입니다.',
    // HttpStatus.UNPROCESSABLE_ENTITY,
    // );
    // }

    // throw문을 만나게 되면 바로 browser에 response로 보냄
    // 검증문은 service에 있는게 재사용성에 좋음
    this.checkSoldOut({ product });

    const result = this.productsRepository.save({
      ...product,
      ...updateProductInput,
    });

    return result;
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    // 1. 실제 삭제
    // const result = await this.productsRepository.delete({ id: productId });
    // return result.affected ? true : false;

    // 2. 소프트 삭제 - is_deleted
    // this.productsRepository.update({ id: productId }, { is_deleted: true });

    // 3. 소프트 삭제 - deleted_at
    // this.productsRepository.update(
    // { id: productId },
    // { deleted_at: new Date() },
    // );

    // 4. 소프트 삭제(TypeORM 제공) - softRemove
    // 장점: 배열을 이용해 여러 id를 한번에 삭제할 수 있음
    // 예시: softRemove({id:1}, {id:2}, {id:3})
    // 단점: id로만 삭제 가능
    // this.productsRepository.softRemove({ id: productId });

    // 5. 소프트 삭제(TypeORM 제공) - softDelete
    // 장점: id 없이 다른 컬럼을 이용해 삭제 가능
    // 단점: 여러개 삭제 불가
    const result = await this.productsRepository.softDelete({ id: productId });
    return result.affected ? true : false;
  }

  // 수정 시, 삭제 시 등 동일한 로직을 사용할 경우 실수를 방지하기 위함
  checkSoldOut({ product }: IProductsServiceCheckSoldOut) {
    if (product.is_sold_out) {
      throw new UnprocessableEntityException('이미 판매 완료된 상품입니다.');
    }
  }
}
