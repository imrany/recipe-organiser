import { Button } from "@/components/ui/button"
import { ChevronRight, Home, Menu, Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Link } from "react-router-dom";
import { GlobalContext } from "@/context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import AddRecipeForm from "./AddRecipeForm";

type LinkType={
    label:string,
    href:string,
    className?:string,
    variant:any,
    icon?:any
}

export default function Header({
    functions
}:{
    functions:{
        getUserRecipes?:any
    }
}) {
  const { userDetails }=useContext(GlobalContext)
  const [isMobile,setIsMobile]=useState(false)
  const [open, setOpen] = useState(false); // Manage menu visibility

  const links:LinkType[]=[
    {
        label:"Recipes",
        href:"/",
        className:"hover:text-[var(--primary-01)] text-[var(--text-primary-04)]",
        variant:"ghost"
    },
  ]

  const mobileLinks:LinkType[]=[
    {
        label:"Recipes",
        icon:(<Home className="text-[var(--primary-01)] w-[20px] h-[20px]"/>),
        href:"/",
        variant:"link"
    },
  ]

  const handleClose = () => {
    setOpen(false); // Set open state to false to close the menu
  };
  
  function checkScreen(){
    if(screen.width>768){
        setIsMobile(false)
    }else{
        setIsMobile(true)
    }
  }

  
  useEffect(()=>{
    checkScreen()
    if (typeof window !== 'undefined') {
        window.onresize=checkScreen
    }
  },[screen.width])
  return (
    <>
        <header className="font-[family-name:var(--font-geist-sans)] bg-[var(--body-bg)] border-b-[1px] z-50 fixed top-0 left-0 right-0">
            <div className="my-2 mx-2 max-md:my-4 max-md:mx-4">
                <nav className="flex justify-between items-center w-full md:px-5">
                    <Link to="/" className="flex gap-2 text-[var(--primary-01)] font-semibold">
                        Recipe organiser
                    </Link>
                    
                    {isMobile?(
                        <Drawer open={open} onOpenChange={setOpen}>
                            <DrawerTrigger asChild>
                                <Menu onClick={() => setOpen(true)} className="w-[23px] h-[23px] text-[var(--primary-01)]"/>
                            </DrawerTrigger>
                            <DrawerContent>
                                <div className="mx-auto w-full max-w-sm">
                                    <DrawerHeader className="none">
                                        <DrawerTitle hidden className="text-[var(--primary-01)]">Recipe organiser</DrawerTitle>
                                        <DrawerDescription hidden className="text-gray-600">Menu</DrawerDescription>
                                    </DrawerHeader>
                                    <div className="flex flex-col gap-y-4 p-4 pb-0">
                                        {mobileLinks.map((link,index)=>(
                                            <Link key={index} to={link.href}>
                                                <Button onClick={handleClose} variant={link.variant} asChild>
                                                    <span className="flex items-center w-full">
                                                        <span className="flex gap-2 items-center">
                                                            {link.icon}
                                                            <span>{link.label}</span>
                                                        </span>
                                                        <ChevronRight className="ml-auto w-[30px] h-[30px] text-[var(--primary-01)]"/>
                                                    </span>
                                                </Button>
                                            </Link>
                                        ))}
                                        
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" asChild>
                                                    <span className="flex items-center w-full">
                                                        <span className="flex gap-2 items-center">
                                                            <Plus className="text-[var(--primary-01)] w-[20px] h-[20px]"/>
                                                            <span>Add new recipe</span>
                                                        </span>
                                                        <ChevronRight className="ml-auto w-[30px] h-[30px] text-[var(--primary-01)]"/>
                                                    </span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] w-[90vw] rounded-md">
                                                <DialogHeader>
                                                    <DialogTitle>Add recipe</DialogTitle>
                                                    <DialogDescription>
                                                        Add a new recipe
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <AddRecipeForm  functions={functions}/>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <DrawerFooter>
                                        <DrawerClose asChild>
                                            <Button onClick={handleClose} className="border-[1px] w-full bg-[var(--primary-01)] text-white">
                                                Close Menu
                                            </Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </div>
                            </DrawerContent>
                        </Drawer>
                    ):(
                        <div id="desktop_nav" className="flex items-center gap-2">
                            {links.map(link=>(
                                <Button key={link.href} variant={link.variant} className={link.className} asChild>
                                    <Link to={link.href}>
                                        {link.label}
                                    </Link>
                                </Button>
                            ))}
                            
                            <Button className="rounded-[50px] text-sm flex items-center justify-center text-slate-800 bg-gray-300 hover:bg-gray-300" asChild>
                                <Link to="/">
                                    {`Logged in as ${userDetails.username}`}
                                </Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    </>
  );
}