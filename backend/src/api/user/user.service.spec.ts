import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserMongoService } from '../../db/user-mongo/user-mongo.service';
import { RoleMongoService } from '../../db/role-mongo/role-mongo.service';
import { NotificationMongoService } from '../../db/notification-mongo/notification-mongo.service';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserMongoService,
        RoleMongoService,
        NotificationMongoService,
      ],
    })
      .overrideProvider(UserMongoService)
      .useValue({})
      .overrideProvider(RoleMongoService)
      .useValue({})
      .overrideProvider(NotificationMongoService)
      .useValue({})
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
