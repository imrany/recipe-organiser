import recipeModel from "../models/recipe.mjs";
import userModel from "../models/user.mjs";
import bcrypt from 'bcryptjs';
import dotenv from "dotenv"
const { compare, genSalt, hash } = bcrypt;
const { config } = dotenv;
config()

export async function register(req, res) {
    try {
        const { username, password, confirm_password, email } = req.body;
        if (username && email && password && confirm_password) {
            if(confirm_password===password){
                const findUser=await userModel.findOne({email})
                if(findUser){
                    return res.status(408).render('register',{ title:"Create an account", error: `This user has an account, try signing in.` });
                }else{
                    const salt = await genSalt(10);
                    const hashedPassword = await hash(password, salt);
                    const user = await userModel.create({username, email, password:hashedPassword});
                    // Set user in session 
                    console.log(user);
                    req.session.user = user
                    return res.redirect("/recipes");
                }
            }else{
                return res.status(408).render('register',{ title:"Create an account", error: `Password does not match.` });
            }
        } else {
            return res.status(408).render('register',{ title:"Create an account", error: "Enter all the required fields" });
        }
    } catch (error) {
        console.error('Error:', error); // Return an error response
        return res.status(500).render('register',{ title:"Create an account", error: error.message });
    }
}

export async function login(req,res) {
    try{
        const { password,email } = req.body
        if(email&&password){
            const user=await userModel.findOne({email})
            if(user){
                if (user.email&&await compare(password,user.password)) {
                    req.session.user = user;
                    res.redirect('/recipes'); 
                }else if(await compare(password,user.password)===false){
                    return res.render('login', { title: 'Login', error: 'You have enter the wrong password'})
                }
            }else{
                res.status(404).render('login', { title: 'Login', error:`Account associated with email ${email} does not exist!`})
            }
        }else{
            return  res.render('login', { title: 'Login', error:"Enter all the required fields"})
        }
    } catch (error) {
        console.error('Error:', error); // Return an error response
        return  res.render('login', { title: 'Login', error: error.message });
    }
}

export async function getUserDetails(req,res) {
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
    } catch (error) {
        console.error('Error:', error); // Return an error response
        return res.status(500).json({ error: error.message });
    }
}

export const updateUser=async(req, res)=>{
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
    }catch (error){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteUser = async (req, res) => {
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}