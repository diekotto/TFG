import {
  HttpService,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductMongoService } from '../../db/product-mongo/product-mongo.service';
import { ReadProductResponseDto } from './dto/read-product-response-dto';
import {
  Product,
  ProductDocument,
} from '../../db/product-mongo/product-schema';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration';
import { OpenfoodMongoService } from '../../db/openfood-mongo/openfood-mongo.service';
import { CreateProductResponseDto } from './dto/create-product-response-dto';

@Injectable()
export class ProductService {
  private openFoodUrl =
    'https://world.openfoodfacts.org/api/v0/product/{{ean}}.json';

  constructor(
    private config: ConfigService<AppConfig>,
    private productsMongo: ProductMongoService,
    private openfoodMongo: OpenfoodMongoService,
    private httpClient: HttpService,
  ) {}

  async readAll(): Promise<ReadProductResponseDto[]> {
    const products = await this.productsMongo.findAll();
    return products.map((p: ProductDocument) =>
      ReadProductResponseDto.fromProductDocument(p),
    );
  }

  async readByEan(ean: string): Promise<ReadProductResponseDto> {
    let product: ProductDocument = await this.productsMongo.findOneBy(
      'ean',
      ean,
    );
    if (!product) {
      const response: AxiosResponse = await this.httpClient
        .get(this.openFoodUrl.replace('{{ean}}', ean), {
          headers: {
            'User-Agent': this.config.get('openFoodUserAgent'),
          },
        })
        .toPromise();
      await this.openfoodMongo.create({
        ...response.data,
        createdAt: new Date(),
      });
      if (!response.data.product) {
        throw new InternalServerErrorException('Error requesting to openfood');
      }
      product = await this.productsMongo.create(
        ProductService.fromOpenFoodToProduct(response.data.product),
      );
    }
    return ReadProductResponseDto.fromProductDocument(product);
  }

  async updateByEan(
    ean: string,
    input: CreateProductResponseDto,
  ): Promise<ReadProductResponseDto> {
    const product: ProductDocument = await this.productsMongo.findOneBy(
      'ean',
      ean,
    );
    if (!product) {
      throw new NotFoundException(`Product with ean ${ean} not found`);
    }
    product.alias = input.alias;
    product.limits = input.limits;
    product.pvp = input.pvp;
    product.code = input.code;
    await product.save();
    return ReadProductResponseDto.fromProductDocument(product);
  }

  async deleteByEan(ean: string): Promise<void> {
    const product: ProductDocument = await this.productsMongo.findOneBy(
      'ean',
      ean,
    );
    if (!product) {
      throw new NotFoundException(`Product with ean ${ean} not found`);
    }
    await this.productsMongo.deleteOneByConditions({ ean });
    return;
  }

  private static fromOpenFoodToProduct(response: any): Product {
    return {
      name: response.product_name_es || response.product_name,
      ean: response.code,
      quantity: response.quantity,
      categories: response.categories,
      labels: response.labels,
      allergens: response.allergens,
      ingredients: response.ingredients_text_es || response.ingredients_text,
      imageUrl: response.image_front_url,
    } as Product;
  }
}
