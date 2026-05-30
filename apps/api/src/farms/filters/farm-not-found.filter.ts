import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { FarmNotFoundException } from '../exceptions/farm-not-found.exception';

@Catch(FarmNotFoundException)
export class FarmNotFoundFilter implements ExceptionFilter {
    private readonly logger = new Logger(FarmNotFoundFilter.name);

    catch(exception: FarmNotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        this.logger.warn(`[${request.method}] ${request.url} - Lavoura não encontrada.`);

        response.status(status).json({
            erro: 'Lavoura não encontrada',
            mensagem: exception.message,
            data: new Date().toISOString(),
        });
    }
}