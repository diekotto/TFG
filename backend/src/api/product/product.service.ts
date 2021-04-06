import {
  HttpService,
  Injectable,
  InternalServerErrorException,
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
