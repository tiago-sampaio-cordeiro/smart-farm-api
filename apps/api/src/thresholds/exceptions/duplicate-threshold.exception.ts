import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateThresholdException extends HttpException {
  constructor(type: string, farmId: string) {
    super(
      `Já existe um threshold do tipo "${type}" configurado para a lavoura "${farmId}".`,
      HttpStatus.CONFLICT,
    );
  }
}
