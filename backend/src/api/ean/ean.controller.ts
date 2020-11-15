import { Controller, Get, HttpService, Param } from '@nestjs/common';

@Controller('ean')
export class EanController {
  constructor(private http: HttpService) {}

  @Get(':ean')
  async readProductByEan(@Param('ean') ean: string): Promise<any> {
    return (
      await this.http
        .get(`https://world.openfoodfacts.org/api/v0/product/${ean}.json`)
        .toPromise()
    ).data;
  }
}
