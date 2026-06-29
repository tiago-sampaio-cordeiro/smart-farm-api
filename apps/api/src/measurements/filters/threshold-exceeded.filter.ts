import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { ThresholdExceededException } from '../exceptions/threshold-exceeded.exception';

@Catch(ThresholdExceededException)
export class ThresholdExceededFilter implements ExceptionFilter {
  private readonly logger = new Logger(ThresholdExceededFilter.name);

  catch(exception: ThresholdExceededException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.warn(
      `[${request.method}] ${request.url} - Limite de medição ultrapassado.`,
    );

    response.status(status).json({
      erro: 'Limite Ultrapassado',
      mensagem: exception.message,
      sugestao: 'Verifique os thresholds configurados para esta lavoura.',
      data: new Date().toISOString(),
    });
  }
}
