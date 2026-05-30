import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { DuplicateThresholdException } from '../exceptions/duplicate-threshold.exception';

@Catch(DuplicateThresholdException)
export class DuplicateThresholdFilter implements ExceptionFilter {
    private readonly logger = new Logger(DuplicateThresholdFilter.name);

    catch(exception: DuplicateThresholdException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        this.logger.warn(`[${request.method}] ${request.url} - Tentativa de criar threshold duplicado.`);

        response.status(status).json({
            erro: 'Threshold Duplicado',
            mensagem: exception.message,
            sugestao: 'Use o método PUT para atualizar o threshold existente.',
            data: new Date().toISOString(),
        });
    }
}