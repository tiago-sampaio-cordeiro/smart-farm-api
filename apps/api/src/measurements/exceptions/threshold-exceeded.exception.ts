import { HttpException, HttpStatus } from '@nestjs/common';

export class ThresholdExceededException extends HttpException {
  constructor(type: string, value: number, max: number) {
    super(
      `Alerta: o valor de ${type} (${value}) ultrapassou o limite máximo configurado (${max}).`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
