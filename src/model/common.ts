export type Envs = {
  LOG_LEVEL: string;
  TRIP_API_URL: string;
  TRIP_API_KEY: string;
};

export class ApiError extends Error {
  constructor(public body: { code: number; message: string }) {
    super(body.message);
    this.name = 'ApiError';
  }
}
