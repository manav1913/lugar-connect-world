import { Children, createContext, useState, useContext } from "react";
import type {User} from "@supabase/supabase-js"
import { supabase } from "../supabase-client";

interface AuthContextType{
    user: User | null
    signInWithGitHub: () => void
    signOut:()=> void

}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children:React.ReactNode})=>{
    const [user, setUser] = useState<User | null>(null)

    const signInWithGitHub =()=>{
        supabase.auth.signInWithOAuth({provider:"github"})
    }

    const signOut = ()=>{}

    return <AuthContext.Provider value={{user, signInWithGitHub, signOut}}>
        {" "}
        {children}{""}
        </AuthContext.Provider>
}


export const useAuth = (): AuthContextType =>{
    const context = useContext(AuthContext)
    if(context === undefined){
        throw new Error("useAuth must be used within the AuthProvider")
    }

    return context
}