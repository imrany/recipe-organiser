import express from "express"
import { deleteUser, getUserDetails, signIn, signUp, updateUser } from "../controllers/user";
import { protectUser } from "../middleware";
import { addRecipe, deleteRecipe, fetchRecipes, fetchUserRecipes, fetchUserRecipesById, searchRecipeUsingQueryParams, updateRecipe } from "../controllers/recipe";

const router=express.Router();

router.post("/sign-in",signIn)
router.post("/sign-up",signUp)
router.patch("/users/:email",updateUser)
router.get("/users/:email",protectUser,getUserDetails)
router.delete("/users/:email",protectUser,deleteUser)

router.post("/recipes",protectUser,addRecipe)
router.get("/recipes",protectUser,fetchRecipes)
router.get("/recipes/:email",protectUser,fetchUserRecipes)
router.patch("/recipes/:id",protectUser,updateRecipe)
router.delete("/recipes/:id",protectUser,deleteRecipe)
//get: https://example.com/api/recipe?recipe_name=chocolate&email=example@gmail.com
router.get("/recipe",protectUser,searchRecipeUsingQueryParams)
//get: https://example.com/api/recipe/1617617
router.get("/recipe/:id",protectUser,fetchUserRecipesById)


export default router;