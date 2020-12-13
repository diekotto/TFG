import { Test, TestingModule } from '@nestjs/testing';
import { HeadquarterController } from './headquarter.controller';
import { HeadquarterService } from './headquarter.service';
import { HeadquarterMongoModule } from '../../db/headquarter-mongo/headquarter-mongo.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { Mongoose } from 'mongoose';

describe('HeadquarterController (e2e)', () => {
  let controller: HeadquarterController;
  let connection: Mongoose;

  beforeAll(async () => {
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

    connection = module.get<'MONGODB_CONNECTION'>('MONGODB_CONNECTION') as any;
    controller = module.get<HeadquarterController>(HeadquarterController);
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
