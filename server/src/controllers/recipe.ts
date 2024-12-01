import axios from "axios"
import { config } from "dotenv";
import recipeModel from "../models/recipe";
config()

export const addRecipe = async (req: any, res: any) => {
    try {
        const { recipe_name, ingredients, directions, email }=req.body
        if(recipe_name&&ingredients&&directions&&email){
            const findRecipe=await recipeModel.findOne({recipe_name})
            if(findRecipe){
                res.json({error:`That recipe exists, try to add another recipe`})
            }else{
                const { data } = await axios.get(`https://api.unsplash.com/search/photos`, { 
                    params: { 
                        query: recipe_name, client_id: `${process.env.UNSPLASH_ACCESS_KEY}`, per_page: 1 
                    } 
                }); 
                const image = data.results[0].urls.small
                console.log(image)
                const addedRecipe=await recipeModel.create({recipe_name, ingredients, directions, email, image})
                if(addedRecipe){
                    return res.status(201).json({message:`Recipe added successful`})
                }
            }
        }else{
            res.json({error:`Fill all inputs`})
        }
    } catch (error: any) {
        console.error( error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const searchRecipeUsingQueryParams = async (req: any, res: any) => {
    try {
        const { recipe_name }=req.query
        const findRecipe=await recipeModel.find({recipe_name})
        if(findRecipe){
            res.json({recipe:findRecipe})
        }else{
            res.status(404).json({error:`Recipe not found`})
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const fetchUserRecipesById = async (req: any, res: any) => {
    try {
        const { id }=req.params
        const recipe= await recipeModel.findById({_id:id})
        res.status(200).json({recipe})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const fetchRecipes = async (req: any, res: any) => {
    try {
        const recipes=await recipeModel.find({}).sort({created_at:-1})
        res.status(200).json({recipes})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const fetchUserRecipes = async (req: any, res: any) => {
    try {
        const { email }=req.params
        const recipesUser= await recipeModel.find({email})
        res.status(200).json({recipes:recipesUser})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateRecipe=async(req:any, res:any)=>{
    try{
        const { id }=req.params;
        const { recipe_name, ingredients, directions }=req.body
        if(recipe_name&&ingredients&&directions){
           await recipeModel.findByIdAndUpdate({_id:id},{
                ...req.body
           })
           res.status(200).json({message:"Recipe updated"})
        }else{
            res.status(408).json({ error: "Fill all the inputs" });
        }
    }catch (error:any){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteRecipe = async (req: any, res: any) => {
    try {
        const { id }=req.params
        if(!recipeModel.findOne({_id:id})){
            return res.status(404).json({error:'No such recipe'})
        } 

        const deleteRecipe=await recipeModel.findByIdAndDelete({_id:id})
        if(deleteRecipe){
            res.send({message:`recipe was delete successfully`});
        }else{
            res.send({error:`Cannot delete this recipe!`});
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
