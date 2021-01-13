import { Test, TestingModule } from '@nestjs/testing';
import { FamilyController } from './family.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { FamilyMongoModule } from '../../db/family-mongo/family-mongo.module';
import { FamilyService } from './family.service';
import { Mongoose } from 'mongoose';

describe('FamilyController (e2e)', () => {
  let controller: FamilyController;
  let connection: Mongoose;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        FamilyMongoModule,
      ],
      controllers: [FamilyController],
      providers: [FamilyService],
    }).compile();

    connection = module.get<'MONGODB_CONNECTION'>('MONGODB_CONNECTION') as any;
    controller = module.get<FamilyController>(FamilyController);
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
