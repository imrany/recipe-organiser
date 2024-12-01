import { GlobalContext } from "@/context"
import { useToast } from "@/hooks/use-toast"
import { useContext, useState } from "react"
import { ToastAction } from "./ui/toast"
import { DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

export default function AddRecipeForm({
    functions
}:{
    functions:{
        getUserRecipes?:any
    }
}) {
    const { API_URL }=useContext(GlobalContext)
    const { toast }=useToast()
    const [isDisabled,setIsDisabled]=useState(false)

    async function handleAddRecipe(e:any) {
        try{
            e.preventDefault()
            setIsDisabled(true)    
            const stringifyData:any=localStorage.getItem("user-details")
            const { email, token }=JSON.parse(stringifyData)

            const url=`${API_URL}/api/recipes`
            const response=await fetch(url,{
                method:"POST",
                headers:{
                    "authorization":`Bearer ${token}`,
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    recipe_name:e.target.recipe_name.value, 
                    ingredients:e.target.ingredients.value, 
                    directions:e.target.directions.value,
                    email
                })
            })
            const parseRes=await response.json()
            if(parseRes.error){
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: parseRes.error,
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                })
                setIsDisabled(false)    
            }else{
                console.log(parseRes)
                e.target.reset()
                setIsDisabled(false)    
                functions.getUserRecipes()
            }
        }catch(error:any){
            setIsDisabled(false)    
            console.log(error.message)
            toast({
                variant: "destructive",
                description: error.message,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }
    return(
        <form onSubmit={handleAddRecipe} className="grid gap-4 py-4">
            <div className="flex flex-col max-sm:w-full space-y-1.5">
                <Label htmlFor="recipe_name" className="text-[var(--primary-01)]  required">Recipe name</Label>
                <Input id="recipe_name" name="recipe_name" type="text" placeholder="Enter your recipe name" className="border-[var(--primary-03)] outline-[1px] active:outline-[var(--primary-01)] focus:border-[var(--primary-01)] outline-[var(--primary-01)]" required/>
            </div>
            <div className="flex flex-col max-sm:w-full space-y-1.5">
                <Label htmlFor="ingredients" className="text-[var(--primary-01)]  required">Ingredients</Label>
                <Textarea  id="ingredients" name="ingredients" placeholder={`List your ingredients... in Markdown format i.e \n - Salt`} className="border-[var(--primary-03)] outline-[1px] active:outline-[var(--primary-01)] focus:border-[var(--primary-01)] outline-[var(--primary-01)]" required/>
            </div>
            <div className="flex flex-col max-sm:w-full space-y-1.5">
                <Label htmlFor="directions" className="text-[var(--primary-01)]  required">Directions</Label>
                <Textarea id="directions" name="directions" placeholder={`List your steps... in Markdown format i.e \n - Cut five onions`} className="border-[var(--primary-03)] outline-[1px] active:outline-[var(--primary-01)] focus:border-[var(--primary-01)] outline-[var(--primary-01)]" required/>
            </div>

            <DialogFooter>
                <Button type="submit" variant={isDisabled===false?"default":"outline"} disabled={isDisabled} className={`h-[40px] w-full ${isDisabled===false?"bg-[var(--primary-01)] font-semibold hover:bg-[var(--primary-01)]":"bg-gray-400 font-semibold hover:bg-gray-400"}`}>
                    {isDisabled===false?(<p>Add</p>):(<p>Adding...</p>)}
                </Button>
            </DialogFooter>
        </form>
    )
}