import { Request } from 'express';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // CODIGO ANTES DEL CONTROLADOR
    const req: Request = context.switchToHttp().getRequest();
    const bearer: string = req.header('Authorization');
    if (!bearer || typeof bearer !== 'string' || bearer.length < 1)
      throw new BadRequestException('Bad bearer token');
    console.log('Barear token catched');
    return next.handle(); // CODIGO DESPUÉS DEL CONTROLADOR
  }
}
