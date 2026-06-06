export type ErrorCode = 'PREDICTION_LOCKED' | 'SCORE_CALCULATION_NOT_ALLOWED' | 'DUPLICATE_PREDICTION';

export interface AppError {
  readonly error: string;
  readonly code: ErrorCode;
  readonly timestamp: string; // ISO 8601
}
