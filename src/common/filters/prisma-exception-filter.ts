import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        return response.status(status).json({
          statusCode: status,
          message: `Conflito de dados no campo: ${exception.meta?.target}`,
        });
      }

      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        return response.status(status).json({
          statusCode: status,
          message: 'Registro não encontrado.',
        });
      }

      case 'P2003': {
        const status = HttpStatus.BAD_REQUEST;
        return response.status(status).json({
          statusCode: status,
          message: 'Erro de relacionamento: uma chave estrangeira falhou.',
        });
      }

      case 'P2011': {
        const status = HttpStatus.BAD_REQUEST;
        return response.status(status).json({
          statusCode: status,
          message: `Campo obrigatório ausente: ${exception.meta?.target}`,
        });
      }

      default:
        return super.catch(exception, host);
    }
  }
}