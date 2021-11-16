import { Endpoint } from "./Endpoint";

export class Router {
  private readonly _endpoints: Set<Endpoint> = new Set<Endpoint>()
  private readonly _routers = new Map<string, Router>()

  constructor() {
  }

  add(endpoint: Endpoint) {
    this._endpoints.add(endpoint)
  }

  mount(router: Router, relativePath: string) {
    this._routers.set(relativePath, router)
  }

  get endpoints() { return this._endpoints }
}