import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return (
      '<h1>Bienvenido al API del Economato Social</h1>' +
      '<p>Esta aplicación es un trabajo de fin de grado en 2021, ' +
      'hecha para el economato social ' +
      'de Cáritas en Alicante, ' +
      'a través de la Universidad de Alicante</p>' +
      '<p><strong>Coded by Diego Maroto.</strong></p>'
    );
  }
}
