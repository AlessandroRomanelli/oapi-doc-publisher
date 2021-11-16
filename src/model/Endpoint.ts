import { Method } from "./Method";
import { ResponseType } from "./ResponseType";

export class Endpoint {
  private readonly _method: Method
  private readonly _path: string
  private readonly _responses: ResponseType[]

  constructor(method: Method, path: string, responses: ResponseType[]) {
    this._method = method
    this._path = path
    this._responses = responses
  }

  public get path() { return this._path }
  public get method() { return this._method }
  public get responses() { return this._responses }
}