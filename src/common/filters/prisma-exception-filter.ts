import {
  ArgumentsHost,
  Catch,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const buildResponse = (
      status: number,
      errorCode: string,
      message: string,
      field?: unknown
    ) => ({
      statusCode: status,
      errorCode,
      field,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;

        return response
          .status(status)
          .json(
            buildResponse(
              status,

              'UNIQUE_CONSTRAINT',

              'This value already exists.',

              exception.meta?.target
            )
          );
      }

      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;

        return response
          .status(status)
          .json(
            buildResponse(
              status,

              'RECORD_NOT_FOUND',

              'Record not found.'
            )
          );
      }

      case 'P2003': {
        const status = HttpStatus.BAD_REQUEST;

        return response
          .status(status)
          .json(
            buildResponse(
              status,

              'FOREIGN_KEY_CONSTRAINT',

              'Relationship validation failed.'
            )
          );
      }

      case 'P2011': {
        const status = HttpStatus.BAD_REQUEST;

        return response
          .status(status)
          .json(
            buildResponse(
              status,

              'REQUIRED_FIELD',

              'Required field missing.',

              exception.meta?.target
            )
          );
      }

      default: return super.catch(exception, host);
    }
  }
}