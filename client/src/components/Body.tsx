import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, SortDesc } from "lucide-react";
import { Button } from "./ui/button";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeType } from "../types";
import { useEffect, useState } from "react";
import AddRecipeForm from "./AddRecipeForm";
import { Skeleton } from "./ui/skeleton";
import SearchRecipe from "./SearchRecipe";

export default function Body({
    recipes,
    functions
}:{
    recipes:RecipeType[],
    functions:{
        getUserRecipes:any,
        handleSearchRecipe:any
    }
}) {
 const [isMobile,setIsMobile]=useState(false)

 const updateTransformValue = () => {
    const screenWidth = window.innerWidth;
    const newTransformValue:boolean = screenWidth > 640 ? false : true;
    setIsMobile(newTransformValue);
 };

  useEffect(()=>{
    updateTransformValue();
    window.addEventListener('resize', updateTransformValue);
    return () => window.removeEventListener('resize', updateTransformValue);
 }, [isMobile])
  return (
    <div className="flex font-[family-name:var(--font-geist-sans)] pt-[63px] h-screen flex-col w-full p-4">
        <div className="flex items-center flex-wrap justify-between gap-1 mb-6">
            <p className="text-xl font-semibold text-[var(--primary-01)]">Favorite recipes</p>
            {!isMobile?(
                <div className="flex gap-2 items-center flex-wrap">
                    <div className="flex items-center rounded-[50px] gap-2 bg-slate-100 py-2 px-3">
                        <Search className="text-gray-500 w-[20px] h-[20px]"/>
                        <input id="search" onChange={(e)=>functions.handleSearchRecipe(e.target.value)} name="search" type="search" placeholder="Search recipe..." className="bg-slate-100 h-full border-none active:border-none focus:outline-none active:outline-none focus:border-none" required/>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex gap-2 rounded-[50px]">
                                <p>Add New Recipe</p>
                                <Plus />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] w-[90vw] rounded-md">
                            <DialogHeader>
                                <DialogTitle>Add recipe</DialogTitle>
                                <DialogDescription>
                                    Add a new recipe
                                </DialogDescription>
                            </DialogHeader>
                            <AddRecipeForm functions={functions}/>
                        </DialogContent>
                    </Dialog>
                </div>
            ):(
                <div className="flex gap-2 items-center flex-wrap">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center justify-center h-[35px] w-[32px] rounded-[50px]">
                                <Search />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] w-[90vw] rounded-md">
                            <DialogHeader>
                                <DialogTitle>Search</DialogTitle>
                                <DialogDescription>
                                    Search for any recipe by its name
                                </DialogDescription>
                            </DialogHeader>
                            <SearchRecipe functions={functions}/>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center justify-center h-[35px] w-[32px] rounded-[50px]">
                                <Plus />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] w-[90vw] rounded-md">
                            <DialogHeader>
                                <DialogTitle>Add recipe</DialogTitle>
                                <DialogDescription>
                                    Add a new recipe
                                </DialogDescription>
                            </DialogHeader>
                            <AddRecipeForm functions={functions}/>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
        {recipes&&recipes.length!==0?(
            <>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" className="ml-auto flex gap-2 rounded-[50px]">
                        <p>Sort by</p>
                        <SortDesc />
                    </Button>
                </div>
                <div className="pt-4 max-sm:flex flex-wrap gap-2 max-sm:gap-y-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center">
                    {recipes.map(recipe=>{
                        return(
                            <RecipeCard key={recipe._id} recipe={recipe}/>     
                        )
                    })}
                </div>
            </>
        ):(
            <div className="pt-4 max-sm:flex flex-wrap gap-2 max-sm:gap-y-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center">
                {[1,2,3,4].map(n=>(
                    <div key={n} className="flex flex-col space-y-3">
                        <Skeleton className="h-[200px] w-[280px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[280px]" />
                            <Skeleton className="h-4 w-[230px]" />
                        </div>
                    </div>
                ))}
            </div>
            // <div className="w-full mt-[200px] flex flex-col justify-center items-center">
            //     <p className="text-center max-md:text-sm text-gray-500">There are no recipes, add one</p>
            // </div>
        )}
    </div>
  )
}
