import Header from "@/components/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastAction } from "@/components/ui/toast"
import { GlobalContext } from "@/context"
import { useToast } from "@/hooks/use-toast"
import { RecipeType } from "@/types"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import MarkedList from "@/components/MarkedList"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import EditRecipeSheet from "@/components/EditRecipeSheet"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"

export default function Recipe() {
    const { id } =useParams()
    const { API_URL }=useContext(GlobalContext)
    const { toast } =useToast()
    const navigate=useNavigate()
    const [recipe, setRecipe]=useState<RecipeType>({
        _id:"",
        recipe_name: "",
        ingredients: "",
        directions: "",
        email: "",
        image:"",
        created_at: ""
    })

    async function getUserRecipe() {
        try{
          const stringifyData:any=localStorage.getItem("user-details")
          const { token }=JSON.parse(stringifyData)
      
          const url=`${API_URL}/api/recipe/${id}`
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
            console.log(parseRes)
            setRecipe(parseRes.recipe)
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

    async function handleDeleteRecipes() {
        try{
          const stringifyData:any=localStorage.getItem("user-details")
          const { token }=JSON.parse(stringifyData)
      
          const url=`${API_URL}/api/recipes/${id}`
          const response=await fetch(url,{
            method:"DELETE",
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
            console.log(parseRes)
            navigate("/")
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
    
    useEffect(()=>{
        getUserRecipe()
    },[])
  return (
    <>
        <Header functions={{}}/>
        <div className="h-screen flex flex-col items-center pt-[63px]">
            <div className="flex justify-center md:px-4 pb-8 items-center">
                <Card className="w-full md:w-[70vw] rounded-none shadow-none border-none">
                    <CardHeader>
                        <CardTitle className="text-3xl font-semibold text-[var(--primary-01)]">
                            {recipe?(
                                <div className="flex justify-between">
                                    <p>{recipe.recipe_name} Recipe</p>
                                    <div className="flex">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="ghost">
                                                    <Edit/>
                                                </Button>
                                            </SheetTrigger>
                                            <EditRecipeSheet recipe={recipe} functions={{getUserRecipe}}/>
                                        </Sheet> 
                                        
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-red-100 hover:text-red-500">
                                                    <Trash/>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your
                                                        account and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDeleteRecipes}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ):(
                                <Skeleton className="w-[60vw] h-[20px] rounded-full" />
                            )}
                        </CardTitle>
                        <CardDescription>
                            {recipe?(
                                <>
                                    A detailed recipe for {recipe.recipe_name}, follow the instrauctions to get best results
                                </>
                            ):(
                                <Skeleton className="w-[60vw] h-[20px] rounded-full" />
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex flex-col gap-4">
                            {recipe?(
                                <div className="w-[100vw] md:mx-6 h-[300px] md:w-[60vw] md:p-1 md:rounded-[10px] aspect-w-16 aspect-h-10 bg-gray-100 overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
                                    <img
                                        src={recipe.image}
                                        alt="thumbnail"
                                        className={`group-hover:scale-95 h-full w-full rounded-[10px] group-hover:rounded-2xl transform object-cover transition duration-200 `}
                                    />
                                </div>
                            ):(
                                <Skeleton className="h-[200px] w-[280px] rounded-xl" />
                            )}
                            {recipe?(
                                <div className="flex flex-col gap-2 px-6">
                                    <p className="text-gray-500 text-xl">Ingredients</p>
                                    <MarkedList items={recipe.ingredients}/>
                                </div>
                            ):(
                                <Skeleton className="h-[200px] w-[280px] rounded-xl  px-6" />
                            )}
                            {recipe?(
                                <div className="flex flex-col gap-2  px-6">
                                    <p className="text-gray-500 text-lg">Directions / Steps</p>
                                    <MarkedList items={recipe.directions}/>
                                </div>
                            ):(
                                <Skeleton className="h-[200px] w-[280px] rounded-xl  px-6" />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </>
  )
}
