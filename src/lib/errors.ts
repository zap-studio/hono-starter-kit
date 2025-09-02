export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL: 500,
} as const;

export type AppErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: ContentfulStatusCode;
  readonly details?: unknown;

  constructor(
    code: AppErrorCode,
    message: string,
    status: ContentfulStatusCode,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  static badRequest(msg = 'Invalid request', details?: unknown) {
    return new AppError('BAD_REQUEST', msg, HttpStatus.BAD_REQUEST, details);
  }
  static unauthorized(msg = 'Unauthorized') {
    return new AppError('UNAUTHORIZED', msg, HttpStatus.UNAUTHORIZED);
  }
  static forbidden(msg = 'Forbidden') {
    return new AppError('FORBIDDEN', msg, HttpStatus.FORBIDDEN);
  }
  static notFound(msg = 'Not found') {
    return new AppError('NOT_FOUND', msg, HttpStatus.NOT_FOUND);
  }
  static conflict(msg = 'Conflict', details?: unknown) {
    return new AppError('CONFLICT', msg, HttpStatus.CONFLICT, details);
  }
  static rateLimited(msg = 'Too many requests') {
    return new AppError('RATE_LIMITED', msg, HttpStatus.RATE_LIMITED);
  }
  static internal(msg = 'Internal server error', details?: unknown) {
    return new AppError('INTERNAL', msg, HttpStatus.INTERNAL, details);
  }
}

/**
 * Converts an unknown error to an AppError.
 * @param err The error to convert.
 * @returns The converted AppError.
 */
export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) {
    return err;
  }

  // Typical Zod error shape support (optional)
  const asUnknown = err as { name?: string; issues?: unknown };
  if (asUnknown?.name === 'ZodError') {
    return AppError.badRequest('Validation failed', asUnknown.issues);
  }

  return AppError.internal('Unexpected error', err);
}
