import { verify } from "jsonwebtoken";
import { config } from "dotenv"
import userModel from "./models/user";
config()

export async function protectUser(req:any,res:any,next:any){
    let token
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        try{
            //get token from headers
            token=req.headers.authorization.split(' ')[1]
            //verify token
            const decoded:any=verify(token,`${process.env.JWT_SECRET}`);
            //get user from the token
            req.user=await userModel.findById(decoded.id).select('password')
            next()
        }catch (error){
            res.status(401).send({error:'Not Authorised'})
        }
    }
    if(!token){
        res.status(401).send({error:'No Token Available'})
    }
};