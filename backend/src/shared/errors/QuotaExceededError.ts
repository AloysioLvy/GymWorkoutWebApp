export class QuotaExceededError extends Error {
  readonly statusCode = 429;

  constructor(message = "API quota exceeded") {
    super(message);
    this.name = "QuotaExceededError";
  }
}
