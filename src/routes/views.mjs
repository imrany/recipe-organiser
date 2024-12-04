import express from "express"
import removeMd from 'remove-markdown';
import { isAuthenticated } from "../middleware.mjs";
import recipeModel from "../models/recipe.mjs";

const views=express.Router();

views.get("/",(req,res)=>{
    if(req.session.user){
        res.redirect("/recipes")
    }else{
        res.render('home',{ title : "Home page"})
    }
})

views.get("/login",(req,res)=>{
    if(req.session.user){
        res.redirect("/recipes")
    }else{
        res.render('login',{ title : "Welcome back"})
    }
})

views.get("/forgot-password",(req,res)=>{
    if(req.session.user){
        res.redirect("/recipes")
    }else{
        res.render('forgot-password',{ title : "Reset password"})
    }
})

views.get("/register",(req,res)=>{
    if(req.session.user){
        res.redirect("/recipes")
    }else{
        res.render('register',{ title : "Create an account"})
    }
})

views.get("/add-recipe", isAuthenticated,(req,res)=>{
    res.render('add-recipe',{ 
        title : "Add new recipe",
        user: req.session.user, 
        links: [ 
            { label: 'Recipes', href: '/recipes', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
        ], 
        mobileLinks: [ 
            { label: 'Recipes', href: '/recipes', icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>', class:"hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2" },
            { label: 'Add new recipe', href: '/add-recipe',icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
            { label: 'Logout', href: '/logout',icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
        ] 
    })
})

//get: https://example.com/recipes?recipe_name=chocolate
views.get('/recipes', isAuthenticated, async(req, res) => { 
    const { email }=req.session.user
    const { recipe_name }=req.query
    const recipes= recipe_name?await recipeModel.find({recipe_name,email}).sort({created_at:-1}).lean():await recipeModel.find({email}).sort({created_at:-1}).lean()
    // Preprocess recipes to strip Markdown and slice text 
    const processedRecipes = recipes.map(recipe => ({ 
        ...recipe, 
        ingredientsPreview: removeMd(recipe.ingredients).slice(0, 160) + '...' 
    }));
    res.render('recipes',{ 
        title: recipe_name?recipe_name:'My recipes', 
        user: req.session.user, 
        recipes:processedRecipes,
        links: [ 
            { label: 'Recipes', href: '/recipes', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
        ], 
        mobileLinks: [ 
            { label: 'Recipes', href: '/recipes', icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>', class:"hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2" },
            { label: 'Add new recipe', href: '/add-recipe',icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
            { label: 'Logout', href: '/logout',icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
        ] 
    })
});

function makeMdList(item){
    return item.trim().split("-")
}

views.get("/recipes/:id", isAuthenticated, async(req,res)=>{
    const { id }=req.params
    const recipe= await recipeModel.findById({_id:id})
    let updatedRecipe = { 
        image:recipe.image,
        recipe_name:recipe.recipe_name,
        _id:recipe._id,
        markedIngredients: makeMdList(recipe.ingredients),
        markedDirections: makeMdList(recipe.directions)
    };
    res.render('recipe',{ 
        title: recipe.recipe_name, 
        user: req.session.user, 
        recipe:updatedRecipe,
        links: [ 
            { label: 'Recipes', href: '/recipes', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
        ], 
        mobileLinks: [ 
            { label: 'Recipes', href: '/recipes', icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>', class:"hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2" },
            { label: 'Add new recipe', href: '/add-recipe',icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
            { label: 'Logout', href: '/logout',icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
        ] 
    })
})

views.get("/edit-recipe/:id", isAuthenticated,async(req,res)=>{
    const { id }=req.params;
    const recipe= await recipeModel.findById({_id:id})
    res.render("edit-recipe",{ 
        title: `Edit ${recipe.recipe_name} recipe`, 
        recipe,
        user: req.session.user, 
        links: [ 
            { label: 'Recipes', href: '/recipes', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
        ], 
        mobileLinks: [ 
            { label: 'Recipes', href: '/recipes', icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>', class:"hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2" },
            { label: 'Add new recipe', href: '/add-recipe',icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
            { label: 'Logout', href: '/logout',icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
        ] 
    })
})

views.post("/recipes/:id", isAuthenticated,async(req, res)=>{
    try{
        const { id }=req.params;
        const { recipe_name, ingredients, directions }=req.body
        console.log( recipe_name, ingredients, directions)
        if(recipe_name&&ingredients&&directions){
           await recipeModel.findByIdAndUpdate({_id:id},{
                ...req.body
           })
           res.status(200).redirect(`/recipes/${id}`)
        }else{
            res.status(408).render(`edit-recipe`,{ 
                title: `Edit ${recipe.recipe_name} recipe`, 
                recipe,
                user: req.session.user,
                error: "Fill all the inputs", 
                links: [ 
                    { label: 'Recipes', href: '/recipes', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
                ], 
                mobileLinks: [ 
                    { label: 'Recipes', href: '/recipes', icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>', class:"hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2" },
                    { label: 'Add new recipe', href: '/add-recipe',icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
                    { label: 'Logout', href: '/logout',icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>', class: 'hover:bg-gray-200 hover:text-[var(--primary-01)] text-[var(--text-primary-04)] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2' }, 
                ] 
            });
        }
    }catch (error){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

views.delete("/recipes/:id",isAuthenticated,async (req, res) => {
    try {
        const { id }=req.params
        if(!recipeModel.findOne({_id:id})){
            return res.status(404).redirect("/recipes")
        } 

        const deleteRecipe=await recipeModel.findByIdAndDelete({_id:id})
        if(deleteRecipe){
            res.redirect("/recipes");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

views.get('/logout', (req, res) => { 
    req.session.destroy(); 
    res.redirect('/')
});

export default views