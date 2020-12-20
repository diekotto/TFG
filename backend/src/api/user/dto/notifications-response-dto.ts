import { ApiProperty } from '@nestjs/swagger';
import { NotificationDocument } from '../../../db/notification-mongo/notification-schema';

export class NotificationsResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({
    description: 'Foreign user id',
  })
  user: string;
  @ApiProperty() message: string;
  @ApiProperty({
    format: 'ISO String',
  })
  createdAt: string;

  constructor(o: NotificationsResponseDto) {
    Object.assign(this, o);
  }

  static fromDocument(input: NotificationDocument): NotificationsResponseDto {
    return new NotificationsResponseDto({
      id: input.id,
      user: input.user,
      message: input.message,
      createdAt: input.createdAt.toISOString(),
    });
  }
}
