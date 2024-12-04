import axios from "axios"
import { config } from "dotenv";
import recipeModel from "../models/recipe.mjs";
config()

export const addRecipe = async (req, res) => {
    try {
        const { recipe_name, ingredients, directions }=req.body
        const { email }=req.session.user
        if(recipe_name&&ingredients&&directions&&email){
            const findRecipe=await recipeModel.findOne({recipe_name})
            if(findRecipe){
                res.render("add-recipe",{title:"Add new recipe", error:`That recipe exists, try to add another recipe`})
            }else{
                const { data } = await axios.get(`https://api.unsplash.com/search/photos`, { 
                    params: { 
                        query: recipe_name, client_id: `${process.env.UNSPLASH_ACCESS_KEY}`, per_page: 1 
                    } 
                }); 
                const image = data.results[0].urls.small
                console.log(image)
                const addedRecipe=await recipeModel.create({recipe_name, ingredients:ingredients.trim(), directions:directions.trim(), email, image})
                if(addedRecipe){
                    return res.redirect("/recipes")
                }
            }
        }else{
            res.render("add-recipe",{title:"Add new recipe", error:`Fill all inputs`})
        }
    } catch (error) {
        console.error( error);
        res.status(500).render("add-recipe",{ title:"Add new recipe", error: "Internal Server Error" });
    }
}