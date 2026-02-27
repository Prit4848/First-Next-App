import "next-auth"
import { DefaultSession } from "next-auth"

declare module 'next-auth'{
    interface User{
        _id:string,
        isVerifield:boolean,
        isAcceptingMessages?:boolean
        username:string,
        email:string
    }
    interface Session{
        user:{
        _id:string,
        isVerifield:boolean,
        isAcceptingMessages?:boolean
        username:string,
        email:string
        } & DefaultSession["User"]
    }
}

declare module 'next-auth'{
    interface Jwt{
        _id:string,
        isVerifield:boolean,
        isAcceptingMessages?:boolean
        username:string,
        email:string
    }
}