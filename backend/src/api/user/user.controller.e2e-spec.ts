import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { UserMongoModule } from '../../db/user-mongo/user-mongo.module';
import { RoleMongoModule } from '../../db/role-mongo/role-mongo.module';
import { UserService } from './user.service';
import configuration from '../../config/configuration';
import { Mongoose } from 'mongoose';
import { UserMongoService } from '../../db/user-mongo/user-mongo.service';
import { NotificationMongoModule } from '../../db/notification-mongo/notification-mongo.module';
import { UserDto } from './dto/user-dto';
import { RoleName } from '../../db/role-mongo/role-schema';
import { NotificationMongoService } from '../../db/notification-mongo/notification-mongo.service';

describe('UserController (e2e)', () => {
  let controller: UserController;
  let userMongo: UserMongoService;
  let notificationMongo: NotificationMongoService;
  let connection: Mongoose;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        UserMongoModule,
        RoleMongoModule,
        NotificationMongoModule,
      ],
      providers: [UserService],
      controllers: [UserController],
    }).compile();

    connection = module.get<'MONGODB_CONNECTION'>('MONGODB_CONNECTION') as any;
    notificationMongo = module.get<NotificationMongoService>(
      NotificationMongoService,
    );
    userMongo = module.get<UserMongoService>(UserMongoService);
    controller = module.get<UserController>(UserController);
  });

  afterEach(async () => {
    await userMongo.deleteManyByConditions({});
  });

  afterAll(async () => {
    await connection.connection.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return zero user notifications', async () => {
    const user = await controller.createUser({
      name: 'name',
      email: 'email',
      password: 'password',
      permissions: [RoleName.ADMIN],
    } as UserDto);
    const result = await controller.readAllNotificationsById(user.id);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(0);
  });

  it('should return some user notifications', async () => {
    const user = await controller.createUser({
      name: 'name',
      email: 'email',
      password: 'password',
      permissions: [RoleName.ADMIN],
    } as UserDto);
    const user2 = await controller.createUser({
      name: 'name',
      email: 'email2',
      password: 'password',
      permissions: [RoleName.ADMIN],
    } as UserDto);
    await notificationMongo.create({
      user: user2.id,
      message: 'Some notification',
      createdAt: new Date(),
    });
    for (let i = 0; i < 5; i++) {
      await notificationMongo.create({
        user: user.id,
        message: 'Some notification',
        createdAt: new Date(),
      });
    }
    let result = await controller.readAllNotificationsById(user.id);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(5);
    result = await controller.readAllNotificationsById(user2.id);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(1);
  });
});
