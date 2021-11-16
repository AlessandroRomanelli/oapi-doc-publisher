import path from "path";
import { ESTree } from "meriyah"
import Analyzer from "./Analyzer";
//@ts-ignore
import staticAnalysis from 'static-analysis'


interface OpenAPIGeneratorOptions {
  rootDir?: string
}
export async function OpenAPIGenerator(entryPoint: string, options: OpenAPIGeneratorOptions = {}) {
  const rootDir = options["rootDir"] || process.cwd()
  // new Analyzer(entryPoint, rootDir).generateModels()
  console.log(await staticAnalysis(path.join(rootDir, entryPoint), { nodeModules: false, shallow: true }))
}
