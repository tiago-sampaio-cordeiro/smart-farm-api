import { HttpException, HttpStatus } from '@nestjs/common';

export class FarmNotFoundException extends HttpException {
    constructor(id: string) {
        super(
            `Lavoura com id "${id}" não encontrada.`,
            HttpStatus.NOT_FOUND,
        );
    }
}