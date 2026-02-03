import { Request,Response,NextFunction, RequestHandler} from "express";




const AsyncHandler = (fn:(req:Request,res:Response,next:NextFunction)=>Promise<any>):RequestHandler =>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        Promise.resolve(fn(req,res,next)).catch(next);
    }
}

export default AsyncHandler;