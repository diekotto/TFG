import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JWToken } from '../jwtoken.interface';
import { AppConfig } from '../../../config/configuration';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private configService: ConfigService<AppConfig>) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const bearer: string = req.header('Authorization');
    let token: JWToken;
    try {
      const regex = /^bearer (.+)$/i;
      const g = regex.exec(bearer);
      token = jwt.verify(g[1], this.configService.get('jwtSecret')) as any;
    } catch (err) {
      throw new UnauthorizedException('Bad bearer token');
    }
    req['jwt'] = token;
    return true;
  }
}
