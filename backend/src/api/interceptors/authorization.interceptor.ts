import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // CODIGO ANTES DEL CONTROLADOR
    const req: Request = context.switchToHttp().getRequest();
    const bearer: string = req.header('Authorization');
    const regex = /^bearer (.+)$/i;
    const g = regex.exec(bearer);
    let token;
    try {
      token = jwt.verify(g[1], this.configService.get('ES_JWT_SECRET'));
    } catch (err) {
      throw new BadRequestException('Bad bearer token');
    }
    req['jwt'] = token;
    return next.handle(); // CODIGO DESPUÉS DEL CONTROLADOR
  }
}
