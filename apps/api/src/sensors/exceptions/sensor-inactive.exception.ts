import { HttpException, HttpStatus } from '@nestjs/common';

export class SensorInactiveException extends HttpException {
    constructor(sensorId: string) {
        super(
            `Operação negada: o sensor "${sensorId}" está inativo e não pode registrar medições.`,
            HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }
}