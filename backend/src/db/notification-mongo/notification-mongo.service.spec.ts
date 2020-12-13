import { Test, TestingModule } from '@nestjs/testing';
import { NotificationMongoService } from './notification-mongo.service';

describe('NotificationMongoService', () => {
  let service: NotificationMongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationMongoService],
    }).compile();

    service = module.get<NotificationMongoService>(NotificationMongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
