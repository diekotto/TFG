import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { ConfigModule } from '@nestjs/config';
import { UserMongoModule } from '../../db/user-mongo/user-mongo.module';
import configuration from '../../config/configuration';
import { Mongoose } from 'mongoose';

describe('LoginController (e2e)', () => {
  let controller: LoginController;
  let connection: Mongoose;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        UserMongoModule,
      ],
      providers: [LoginService],
      controllers: [LoginController],
    }).compile();

    connection = module.get<'MONGODB_CONNECTION'>('MONGODB_CONNECTION') as any;
    controller = module.get<LoginController>(LoginController);
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
