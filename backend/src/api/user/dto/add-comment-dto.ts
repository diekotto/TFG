import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { UserCommentDto } from './user-dto';

export class AddCommentDto {
  @ApiProperty() comment: UserCommentDto;

  constructor(o: Partial<AddCommentDto>) {
    Object.assign(this, o);
    this.verifyComment();
  }

  private verifyComment(): void {
    if (!this.comment || !this.comment.author || !this.comment.comment)
      throw new BadRequestException('Bad comment format');
  }
}
