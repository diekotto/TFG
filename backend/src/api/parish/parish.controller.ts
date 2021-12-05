import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { JwtGuard } from '../guards/roles/jwt.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ParishService } from './parish.service';
import { Roles } from '../guards/roles/roles.decorator';
import { RoleName } from '../../db/role-mongo/role-schema';
import { ParishDto } from './dto/parish-dto';

@ApiTags('Products')
@Controller('product')
@UseGuards(JwtGuard, RolesGuard)
@ApiBadRequestResponse({
  description: 'There are params error',
})
@ApiNotFoundResponse({
  description: 'Entity not found',
})
@Controller('parish')
export class ParishController {
  constructor(private service: ParishService) {}

  @Get('/')
  @Roles()
  async getAll(): Promise<ParishDto[]> {
    return (await this.service.getAll()).map((p) => ParishDto.fromDocument(p));
  }

  @Get('/:id')
  @Roles()
  async getById(@Param('id') id: string): Promise<ParishDto> {
    const parish = await this.service.getById(id);
    if (!parish) {
      throw new NotFoundException('Parish not found');
    }
    return ParishDto.fromDocument(parish);
  }

  @Put('/:id')
  @Roles(RoleName.ADMIN)
  async update(@Param('id') id: string, @Body() data: any): Promise<ParishDto> {
    return ParishDto.fromDocument(await this.service.updateOrInsert(data));
  }

  @Delete('/:id')
  @Roles(RoleName.ADMIN)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.service.delete(id);
  }
}
