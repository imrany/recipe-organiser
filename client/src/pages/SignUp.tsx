import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Link, useNavigate } from "react-router-dom"
import { GlobalContext } from "@/context"


export default function SignUp() {
    const { API_URL }=useContext(GlobalContext)
    const { toast } = useToast()
    const navigate = useNavigate()
    const [isDisabled,setIsDisabled]=useState(false)
    async function handleSignUp(e:any) {
        try{
            e.preventDefault()
            if(e.target.confirm.value!==e.target.password.value){
                toast({
                    variant: "destructive",
                    description: "Password doesn't match!",
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                })
            }else{
                setIsDisabled(true)    
                const url=`${API_URL}/api/sign-up`
                const response=await fetch(url,{
                    method:"POST",
                    headers:{
                        "content-type":"application/json"
                    },
                    body:JSON.stringify({
                        username:e.target.username.value,
                        password:e.target.confirm.value,
                        email:e.target.email.value
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
                    const data:any={
                        email:parseRes.user.email,
                        token:parseRes.user.token
                    }
                    console.log(data)
                    const stringifyData=JSON.stringify(data)
                    localStorage.setItem("user-details",stringifyData)
                    navigate('/')
                }
            }
        }catch(error:any){
            setIsDisabled(false)    
            console.log(error.message)
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.message,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }
  return (
    <div className="flex font-[family-name:var(--font-geist-sans)] items-center flex-col h-screen">
        <div className="md:w-[500px] w-[90vw] flex items-center rounded-none h-screen shadow-none">
            <Card className="w-full rounded-none shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-3xl font-semibold text-[var(--primary-01)]">Get Started!</CardTitle>
                    <CardDescription>Get started by creating an account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-x-2 max-sm:gap-y-4 w-full">
                                <div className="flex flex-col max-sm:w-full space-y-1.5">
                                    <Label htmlFor="username" className="text-[var(--primary-01)] font-semibold required">Username</Label>
                                    <Input id="username" name="username" type="text" placeholder="Enter preferred username" className="border-[var(--primary-03)] placeholder:font-semibold outline-[1px] active:outline-[var(--primary-01)] focus:border-[var(--primary-01)] outline-[var(--primary-01)]" required/>
                                </div>
                                <div className="flex flex-col max-sm:w-full space-y-1.5">
                                    <Label htmlFor="email" className="text-[var(--primary-01)] font-semibold  required">Email address</Label>
                                    <Input id="email" name="email" type="email" placeholder="Enter your email" className="border-[var(--primary-03)] placeholder:font-semibold outline-[1px] active:outline-[var(--primary-01)] focus:border-[var(--primary-01)] outline-[var(--primary-01)]" required/>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password" className="text-[var(--primary-01)] font-semibold  required">Password</Label>
                                <Input id="password" name="password" minLength={8} maxLength={24} type="password" placeholder="Enter password" className="border-[var(--primary-03)] placeholder:font-semibold outline-[1px] active:outline-[var(--primary-01)] focus:border-[var(--primary-01)] outline-[var(--primary-01)]" required/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="confirm" className="text-[var(--primary-01)] font-semibold  required">Confirm password</Label>
                                <Input id="confirm" name="confirm" minLength={8} maxLength={24} type="password" placeholder="Confirm password" className="border-[var(--primary-03)] placeholder:font-semibold outline-[1px] active:outline-[var(--primary-01)] focus:border-[var(--primary-01)] outline-[var(--primary-01)]" required/>
                            </div>
                            <Button type="submit" variant={isDisabled===false?"default":"outline"} disabled={isDisabled} className={`h-[40px] ${isDisabled===false?"bg-[var(--primary-01)] hover:bg-[var(--primary-01)]":"bg-gray-400 font-semibold hover:bg-gray-400"}`}>
                                {isDisabled===false?(<p>Create account</p>):(<p>Creating...</p>)}
                            </Button>
                            {/* <p className="text-sm text-gray-500 text-center">Or sign up with</p> */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden>
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm font-medium leading-6">
                                    <span className="bg-white px-6 text-gray-600">Or continue with</span>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Button type="button" className="h-[40px]" variant="outline">
                                    <img alt="" src="/google-vector.svg" width={18} height={18}/>
                                    <span>Sign up with Google</span>
                                </Button>
                            </div>
                            <div className="flex gap-1 text-gray-600 items-center justify-center md:text-sm text-xs">
                                <p>{`Do you have an account?`}</p>
                                <Button variant="link" className="text-[var(--primary-01)] md:text-sm text-xs rounded-[50px]" asChild>
                                    <Link to="/sign_in">Sign in</Link>
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
