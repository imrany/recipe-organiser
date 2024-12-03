import express from "express"
import { deleteUser, getUserDetails, login, register, updateUser } from "../controllers/user.mjs";
import { isAuthenticated } from "../middleware.mjs";
import { addRecipe, fetchRecipes } from "../controllers/recipe.mjs";

const router=express.Router();

router.post("/login",login)
router.post("/register",register)
router.patch("/users/:email",updateUser)
router.get("/users/:email",isAuthenticated,getUserDetails)
router.delete("/users/:email",isAuthenticated,deleteUser)

router.post("/recipes",isAuthenticated,addRecipe)
router.get("/recipes",isAuthenticated,fetchRecipes)

export default router;