import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // O 'next.handle()' executa o Controller. O 'map' pega a resposta que o Controller gerou.
    return next.handle().pipe(
      map(data => ({
        success: true,
        timestamp: new Date().toISOString(),
        data: data, // Coloca os dados reais (ex: o array de usuários) aqui dentro
      })),
    );
  }
}
