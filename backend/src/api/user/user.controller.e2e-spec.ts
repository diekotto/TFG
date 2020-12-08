import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { UserMongoModule } from '../../db/user-mongo/user-mongo.module';
import { RoleMongoModule } from '../../db/role-mongo/role-mongo.module';
import { UserService } from './user.service';
import configuration from '../../config/configuration';

describe('UserController', () => {
  let controller: UserController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        UserMongoModule,
        RoleMongoModule,
      ],
      providers: [UserService],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
