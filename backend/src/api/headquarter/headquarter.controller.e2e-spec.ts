import { Test, TestingModule } from '@nestjs/testing';
import { HeadquarterController } from './headquarter.controller';
import { HeadquarterService } from './headquarter.service';
import { HeadquarterMongoModule } from '../../db/headquarter-mongo/headquarter-mongo.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';

describe('HeadquarterController (e2e)', () => {
  let controller: HeadquarterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        HeadquarterMongoModule,
      ],
      controllers: [HeadquarterController],
      providers: [HeadquarterService],
    }).compile();

    controller = module.get<HeadquarterController>(HeadquarterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
