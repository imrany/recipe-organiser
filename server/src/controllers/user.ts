import { compare, genSalt, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { config } from "dotenv"
import userModel from "../models/user";
import recipeModel from "../models/recipe";
config()

function generateUserToken(id:any){
    return sign({id},`${process.env.JWT_SECRET}`,{
        expiresIn:'10d'
    })
};

export async function signUp(req: any, res:any) {
    try {
        const { username, password, email } = req.body;
        if (username && email && password) {
            const findUser=await userModel.findOne({email})
            if(findUser){
                return res.status(408).json({ error: `This user has an account, try signing in.` });
            }else{
                const salt = await genSalt(10);
                const hashedPassword = await hash(password, salt);
                const user: any = await userModel.create({username, email, password:hashedPassword});
                console.log(user);
                return res.json({
                    msg: `Welcome ${user.username}`,
                    user: {
                        username: user.username,
                        email: user.email,
                        photo: user.photo,
                        token: generateUserToken(user._id),
                    },
                });
            }
        } else {
            return res.status(408).json({ error: "Enter all the required fields" });
        }
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function signIn(req: any,res:any) {
    try{
        const { password,email } = req.body
        if(email&&password){
            const user=await userModel.findOne({email})
            if(user){
                if (user.email&&await compare(password,user.password)) {
                    return res.json({
                        msg:`Welcome ${user.username}`,
                        user:{
                            username:user.username,
                            email:user.email,
                            photo:user.photo,
                            token:generateUserToken(user._id)
                        }
                    })
                }else if(await compare(password,user.password)===false){
                    return res.status(401).json({error:'You have enter the wrong password'})
                }
            }else{
                return res.status(404).json({error:`Account associated with email ${email} does not exist!`})
            }
        }else{
            return res.json({error:"Enter all the required fields"})
        }
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export async function getUserDetails(req: any,res:any) {
    try{
        const { email } = req.params
        const user=await userModel.findOne({email})
        if(user){
            return res.json({
                msg:`Welcome ${user.username}`,
                user:{
                    username:user.username,
                    email:user.email,
                    photo:user.photo,
                    type: user.type,
                    created_at: user.created_at,
                    token:generateUserToken(user._id)
                }
            })
        }else{
            return res.status(404).json({error:`Account associated with email ${email} does not exist!`})
        }
    } catch (error: any) {
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export const updateUser=async(req:any, res:any)=>{
    try{
        const { email }=req.params;
        const { username, password, photo }=req.body
        if(username&&photo){
            await userModel.findOneAndUpdate({email},{
                ...req.body
            })
           res.status(200).json({message:"User updated"})
        }else if(password){
            const salt = await genSalt(10);
            const hashedPassword = await hash(password, salt);
            await userModel.findOneAndUpdate({email},{
                password:hashedPassword
            })
           res.status(200).json({message:"Password updated"})
        }else{
            res.status(408).json({ error: "Fill all the inputs" });
        }
    }catch (error:any){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteUser = async (req: any, res: any) => {
    try {
        const { email }=req.params
        if(!userModel.findOne({ email })){
            return res.status(404).json({error:'No such user'})
        } 

        const deleteUser=await userModel.findOneAndDelete({email})
        if(deleteUser){
            await recipeModel.deleteMany({email})
            res.send({message:`User was delete successfully`});
        }else{
            res.send({error:`Cannot delete this user!`});
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}