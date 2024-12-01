import Body from "@/components/Body"
import Header from "@/components/Header"
import { GlobalContext } from "@/context"
import { RecipeType } from "@/types"
import { useContext, useEffect, useState } from "react"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { API_URL }=useContext(GlobalContext)
  const { toast }=useToast()
  const [recipes,setRecipes]= useState<RecipeType[]>([
    {
      _id:"",
      recipe_name: "",
      ingredients: "",
      directions: "",
      email: "",
      image:"",
      created_at: ""
    }
  ]);
  const [recipesOrigin,setRecipesOrigin]= useState<RecipeType[]>([
    {
      _id:"",
      recipe_name: "",
      ingredients: "",
      directions: "",
      email: "",
      image:"",
      created_at: ""
    }
  ]);

  async function getUserRecipes() {
    try{
      const stringifyData:any=localStorage.getItem("user-details")
      const { email, token }=JSON.parse(stringifyData)
  
      const url=`${API_URL}/api/recipes/${email}`
      const response=await fetch(url,{
        method:"GET",
        headers:{
          "authorization":`Bearer ${token}`
        },
      })
      const parseRes=await response.json()
      if(parseRes.error){
        toast({
          variant: "destructive",
          description: parseRes.error,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }else{
        setRecipesOrigin(parseRes.recipes)
        setRecipes(parseRes.recipes)
      }
    }catch(error:any){
      toast({
        variant: "destructive",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
      console.log(error.message)
    }
  }

  async function handleSearchRecipe(search:string){
    await getUserRecipes()
    let recipeResults:any=[]
    recipesOrigin.map(recipe=>{
      if(recipe.recipe_name.toLowerCase().includes(search.toLowerCase())){
        recipeResults.push(recipe)
      }
    })
    console.log(recipeResults)
    setRecipes(recipeResults)
  }

useEffect(()=>{
  getUserRecipes()
},[])
  return(
    <main className="flex min-h-screen overflow-x-hidden flex-col items-center justify-start">
      <Header functions={{getUserRecipes}}/>
      <Body recipes={recipes} functions={{getUserRecipes, handleSearchRecipe}}/>
    </main>
  )
}