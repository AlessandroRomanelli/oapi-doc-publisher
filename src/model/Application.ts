import { Router } from "./Router";

export class Application extends Router {
  private readonly _basePath = "/"
  private readonly _mountedApps = new Map<string, Application>()
}