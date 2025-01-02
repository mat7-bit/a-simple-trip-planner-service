/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { FastifyInstance, FastifyBaseLogger, FastifyError } from 'fastify';
import { ApiError } from '@models/common';
import { httpErrors } from '@fastify/sensible';
import fp from 'fastify-plugin';
import errorHandler from './api-errors-handler';

// Create mock logger
const mockLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  fatal: jest.fn(),
  silent: jest.fn(),
  child: jest.fn(),
  level: 'info',
} as FastifyBaseLogger;

jest.mock('fastify-plugin', () => jest.fn(fn => fn));

describe('Error Handler Plugin', () => {
  let mockFastify: Partial<FastifyInstance>;
  let capturedHandler: Function;

  beforeEach(() => {
    mockFastify = {
      setErrorHandler: jest.fn().mockImplementation(handler => {
        capturedHandler = handler;
        return mockFastify as unknown as FastifyInstance;
      }),
      log: mockLogger,
      httpErrors: httpErrors,
    };

    const plugin = fp(errorHandler);
    plugin(mockFastify as FastifyInstance, {}, jest.fn());
  });

  it('should transform ApiError to appropriate HTTP error', async () => {
    const apiError = new ApiError({
      code: 403,
      message: 'Forbidden access',
    });

    const result = await capturedHandler(apiError);

    expect(result).toEqual(
      expect.objectContaining({
        statusCode: 403,
        message: 'Forbidden access',
      }),
    );
  });

  it('should transform validation error to 400 bad request', async () => {
    const validationError: FastifyError = {
      validation: [{} as any],
      validationContext: 'body',
      statusCode: 400,
      message: 'Invalid input',
      cause: new Error('Schema validation failed'),
      name: 'ValidationError',
      code: 'FST_ERR_VALIDATION',
    };

    const result = await capturedHandler(validationError);

    expect(result).toEqual(
      expect.objectContaining({
        statusCode: 400,
        message: 'Invalid request: Invalid input',
      }),
    );
  });

  it('should transform unknown errors to 500 internal server error', async () => {
    const criticalError = new Error('Something went wrong');
    criticalError.stack = 'Error stack trace';

    const result = await capturedHandler(criticalError);

    expect(result).toEqual(
      expect.objectContaining({
        statusCode: 500,
        message: 'Critical error. Check logs.',
      }),
    );
  });
});
