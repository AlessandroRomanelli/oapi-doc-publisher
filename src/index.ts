import './pre-start';
import {Application, NextFunction} from "express"; // Must be the first import

interface Layer {
    __handle: any,
    name: string,
    path: string,
    params: {},
}
export default function(app: Application) {
    return (req: Express.Request, res: Express.Response, next: NextFunction) => {
        const stack: Layer[] = app._router.stack
        console.log(stack)
        const endpoints = stack.filter(x => x.name === "bound dispatch")
        const routers = stack.filter(x => x.name === "router")
        const apps = stack.filter(x => x.name === "mounted_app")
        // console.log(routers)

        // console.log(routers.map(x => x.__handle.stack))
        // console.log(endpoints)

        next()
    }
}
