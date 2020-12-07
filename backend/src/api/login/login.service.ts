import * as jwt from 'jsonwebtoken';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { UserDto } from '../user/dto/user-dto';
import { UserMongoService } from '../../db/user-mongo/user-mongo.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { compareSync } from 'bcrypt';
import { JWToken } from '../guards/jwtoken.interface';
import * as moment from 'moment';
import { AppConfig } from '../../config/configuration';

@Injectable()
export class LoginService {
  private genericErrorMessage = 'Login error';

  constructor(
    private userMongo: UserMongoService,
    private configService: ConfigService<AppConfig>,
  ) {}

  async login(input: LoginDto): Promise<UserDto> {
    const user = (await this.userMongo.find('email', input.email))[0];
    if (!user) throw new ForbiddenException(this.genericErrorMessage);
    if (!compareSync(input.password, user.password))
      throw new ForbiddenException(this.genericErrorMessage);
    if (!user.active) {
      user.actionsHistory.push({
        date: new Date(),
        action: 'Attempt to login when inactive',
      });
      await user.save();
      throw new ForbiddenException(this.genericErrorMessage);
    }
    user.accessHistory.push(new Date());
    await user.save();
    return UserService.userMapper(user);
  }

  createJwt(user: UserDto): string {
    const secret = this.configService.get('jwtSecret');
    const payload: Partial<JWToken> = {
      id: user.id,
      roles: user.permissions,
      exp: moment().add(8, 'h').toDate().getTime(),
    };
    return jwt.sign(payload, secret);
  }
}
