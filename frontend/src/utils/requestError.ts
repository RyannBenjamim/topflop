export class RequestError extends Error {
  status: number;
  errorCode?: string;
  errorType?: string;

  constructor(message: string, status: number, errorCode?: string, errorType?: string) {
    super(message);
    this.name = 'RequestError';
    this.status = status;
    this.errorCode = errorCode;
    this.errorType = errorType;
  }
}

export const isRequestError = (error: unknown): error is RequestError =>
  error instanceof RequestError;

export const getErrorMessage = (error: unknown, fallback = 'Não foi possível concluir a ação.') =>
  error instanceof Error && error.message ? error.message : fallback;
