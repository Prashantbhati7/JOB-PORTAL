import { Request,Response,NextFunction, RequestHandler} from "express";




const AsyncHandler = (fn:(req:Request,res:Response,next:NextFunction)=>Promise<any>):RequestHandler =>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try{
            await fn(req,res,next);
        }catch(error){
            next(error);
        }
    }
}

export default AsyncHandler;