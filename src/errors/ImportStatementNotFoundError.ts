export class ImportStatementNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ImportStatementNotFound"
  }
}