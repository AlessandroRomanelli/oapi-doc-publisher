export class MainApplicationNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "MainApplicationNotFound"
  }
}