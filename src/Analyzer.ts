import { ESTree } from "meriyah";
import { Application, Endpoint, Router } from "./model";
// @ts-ignore
import { find } from "abstract-syntax-tree";
import { CallExpression } from "meriyah/dist/src/estree";
import * as ts from "typescript"
import _ from "lodash"


// @ts-ignore
import { parse } from "abstract-syntax-tree";
import * as fs from "fs";
import {
  FileNotFoundError,
  ImportStatementNotFoundError,
  MainApplicationNotFoundError,
  UnresolvedAliasError
} from "./errors";
import path from "path";
import { readFileSync } from "fs";

enum DeclTypes {
  CallExpression = "CallExpression",
  ExpressionStatement = "ExpressionStatement",
  MemberExpression = "MemberExpression",
  VariableDeclaration = "VariableDeclaration"
}


export default class Analyzer {
  private readonly _entryPoint: string
  private readonly _application: Application
  private readonly _rootDir: string
  private readonly _entryProgram: ESTree.Program

  constructor(entryPoint: string, rootDir: string) {
    this._rootDir = rootDir
    this._entryPoint = entryPoint
    this._application = new Application()
    this._entryProgram = this.generateProgramFromFile(this._entryPoint)

  }


  private analyzeFile = (relPath: string, appName: string): [Application[], Router[], Endpoint[]] => {
    console.log(relPath, appName)
    try {
      const program = this.generateProgramFromFile(relPath)
      console.log(program)
    } catch (e) {
      console.error(e)
    }
    return [[], [], []]
  }

  private static findImportByName(program: ESTree.Program, name: string): string {
    const importDeclarations = find(program, `VariableDeclaration [id.name="${name}"] [callee.name="require"]`)
    if (!importDeclarations.length) {
      throw new ImportStatementNotFoundError(`No import found associated with variable: ${name}`)
    }
    const [ importStatement ] = importDeclarations
    return importStatement.arguments[0].value
  }


  private static resolveCalleeName(call: CallExpression): string {
    let current = call.callee.object
    while (current.type !== "Identifier") {
        current = current.object
    }
    return current.name
  }

  private findMainAppNames = (): string[] => {
    const program: ESTree.Program = this.generateProgramFromFile(this._entryPoint)
    const listenCalls: ESTree.CallExpression[] = find(program, {
        type: DeclTypes.CallExpression,
        callee: {
          type: DeclTypes.MemberExpression,
          property: { name: "listen" }
        }
      })
    if (!listenCalls.length) {
      throw new MainApplicationNotFoundError()
    }
    return listenCalls.map(Analyzer.resolveCalleeName)
  }

  private resolveImportPath = (path: string) => {
      const package_json = JSON.parse(readFileSync(`${this._rootDir}/package.json`, { encoding: "utf8" }))
      if (!("_moduleAliases" in package_json)) {
        throw new UnresolvedAliasError()
      }
      if (path in package_json["_moduleAliases"]) {
        return package_json["_moduleAliases"][path]
      }
      return path
  }

  private resolveAppByName = (appName: string): Application => {
    const application = new Application()
    try {
      let importingFile = this.resolveImportPath(Analyzer.findImportByName(this._entryProgram, appName))
      this.analyzeFile(importingFile, appName)
    } catch (error) {

    }
    return application
  }

  public generateModels = (): Application[] => this.findMainAppNames().map(this.resolveAppByName)

  public generateProgramFromFile(relPath: string): ESTree.Program {
    let filePath = path.join(this._rootDir, relPath)
    if (!fs.existsSync(filePath)) throw new FileNotFoundError(`Could not find file: ${filePath}`)
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      const contents = fs.readdirSync(filePath).filter(x => x.includes("index"))
      if (contents.length) {
        filePath = path.join(filePath, contents[0])
      } else {
        throw new FileNotFoundError("Provided a directory without index file")
      }
    }
    const transpiledCode = ts.transpileModule(readFileSync(filePath, { encoding: "utf-8"}), {}).outputText
    return parse(transpiledCode)
  }
}