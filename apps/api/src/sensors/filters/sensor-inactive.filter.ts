import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { SensorInactiveException } from '../exceptions/sensor-inactive.exception';

@Catch(SensorInactiveException)
export class SensorInactiveFilter implements ExceptionFilter {
  private readonly logger = new Logger(SensorInactiveFilter.name);

  catch(exception: SensorInactiveException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.warn(
      `[${request.method}] ${request.url} - Tentativa de medição com sensor inativo.`,
    );

    response.status(status).json({
      erro: 'Sensor Inativo',
      mensagem: exception.message,
      sugestao:
        'Verifique a conexão do sensor e reative-o antes de registrar medições.',
      data: new Date().toISOString(),
    });
  }
}
