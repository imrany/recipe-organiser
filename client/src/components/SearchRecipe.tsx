import { Search } from "lucide-react";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

export default function SearchRecipe({ 
    functions
}:{
    functions:{
        getUserRecipes:any,
        handleSearchRecipe:any
    }
}) {
    
  return (
    <div className="grid gap-4 py-4">
        <div className="flex items-center rounded-md gap-2 bg-slate-100 py-2 px-3">
            <Search className="text-gray-500 w-[20px] h-[20px]"/>
            <input onChange={(e)=>functions.handleSearchRecipe(e.target.value)} id="search" name="search" type="search" placeholder="Search recipe..." className="bg-slate-100 h-full border-none active:border-none focus:outline-none active:outline-none focus:border-none" required/>
        </div>
        <DialogFooter>
            <Button className="bg-[var(--primary-01)] hover:bg-[var(--primary-01)]">Search</Button>
        </DialogFooter>
    </div>
  )
}
