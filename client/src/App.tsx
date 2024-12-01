import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react'
import NotFound from './pages/NotFound';
import { GlobalContext } from "./context";
import Home from "./pages/Home";
import { Toaster } from "@/components/ui/toaster"
import SignIn from "./pages/SignIn";
import { UserType } from "./types";
import { RefreshCw } from "lucide-react";
import SignUp from "./pages/SignUp";
import Recipe from "./pages/Recipe";

function App() {
    const [isLoading,setIsLoading]=useState(true)
    const [isAuth,setIsAuth]=useState(false)
    const API_URL=`http://localhost:8000`;
    const [userDetails,setUserDetails]=useState<UserType>({
        email: "",
        type: "",
        username: "",
        photo: null,
        created_at: "",
        token:""
    })

    async function checkAuth() {
        try{
            setIsLoading(true)
            const stringifyData:any=localStorage.getItem("user-details")
            const { email, token }=JSON.parse(stringifyData)

            const url=`${API_URL}/api/users/${email}`
            const response=await fetch(url,{
                method:"GET",
                headers:{
                    "authorization":`Bearer ${token}`
                }
            })
            const parseRes=await response.json()
            if(parseRes.error){
                setIsLoading(false)
                setIsAuth(false)
            }else{
                const authData:any={
                    email:parseRes.user.email,
                    token:parseRes.user.token
                }
                const userData:UserType={
                    email:parseRes.user.email,
                    type: parseRes.user.type,
                    username: parseRes.user.username,
                    photo: parseRes.user.photo,
                    created_at: parseRes.user.created_at,
                }
                const stringifyData=JSON.stringify(authData)
                localStorage.setItem("user-details",stringifyData)
                setIsLoading(false)
                setIsAuth(true)
                setUserDetails(userData)
            }
        }catch(error:any){
            setIsLoading(false)
            setIsAuth(false)
            console.log(error.message)
        }
    }

    useEffect(()=>{
        checkAuth()
    },[])
    return (
        <>
            {isLoading?(
                <div className="flex flex-col h-screen w-screen items-center justify-center">
                    <p className="text-center w-[80vw] text-gray-500 text-sm flex items-center justify-center gap-1">
                        <RefreshCw className="spinner w-[18px] h-[18px]"/>
                        <span>Loading, please wait...</span>
                    </p>
                </div>
            ):(
                <BrowserRouter>
                    <GlobalContext.Provider value={{ API_URL, userDetails }}>
                        <Routes>
                            <Route path="/sign_in" element={isAuth? <Navigate to="/"/>:<SignIn />} />
                            <Route path="/sign_up" element={isAuth? <Navigate to="/"/>:<SignUp />} />
                            <Route path="/" element={isAuth?<Home />:<Navigate to="/sign_in"/>}/>
                            <Route path="/recipes/:id" element={<Recipe />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </GlobalContext.Provider>
                </BrowserRouter>
            )} 
            <Toaster />
        </>
    )
}

export default App
