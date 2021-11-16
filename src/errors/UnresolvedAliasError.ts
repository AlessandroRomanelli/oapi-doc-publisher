export class UnresolvedAliasError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnresolvedAlias"
  }
}