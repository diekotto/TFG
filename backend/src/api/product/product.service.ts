import { HttpService, Injectable } from '@nestjs/common';
import { ProductMongoService } from '../../db/product-mongo/product-mongo.service';
import { ReadProductResponseDto } from './dto/read-product-response-dto';
import {
  Product,
  ProductDocument,
} from '../../db/product-mongo/product-schema';
import { AxiosResponse } from 'axios';

@Injectable()
export class ProductService {
  private openFoodUrl =
    'https://world.openfoodfacts.org/api/v0/product/{{ean}}.json';

  constructor(
    private productsMongo: ProductMongoService,
    private httpClient: HttpService,
  ) {}

  async readByEan(ean: string): Promise<ReadProductResponseDto> {
    let product: ProductDocument = await this.productsMongo.findOneBy(
      'ean',
      ean,
    );
    if (!product) {
      const response: AxiosResponse = await this.httpClient
        .get(this.openFoodUrl.replace('{{ean}}', ean))
        .toPromise();
      product = await this.productsMongo.create(
        ProductService.fromOpenFoodToProduct(response),
      );
    }
    return ReadProductResponseDto.fromProductDocument(product);
  }

  private static fromOpenFoodToProduct(response: any): Product {
    return {
      name: response.product_name_es || response.product_name,
      quantity: response.quantity,
      categories: response.categories,
      labels: response.labels,
      allergens: response.allergens_from_ingredients,
      ingredients: response.ingredients_text_es || response.ingredients_text,
      imageUrl: response.image_front_url,
    } as Product;
  }
}
