import { UserType } from '@/types'
import { createContext } from 'react'

type Context={
    API_URL:string,
    userDetails:UserType
}

export const GlobalContext=createContext<Context>({
    API_URL:"",
    userDetails:{
        email: "",
        type: "",
        username: "",
        photo: null,
        created_at: "",
        token:""
    }
})
