import { createUser, fetchUserById, loginUser } from "../../services/user.js"

const Query={
    loginUser:async(parent,{email,password})=>{
        return await loginUser(email,password)
    },
    getLoggedInUserDetails:async(parent,parameter,context)=>{
        if (context && context.user){
            const id=context.user.id;
            return fetchUserById(id)
        }
        throw new Error("i dont know who are u")
    }
}

const Mutation={
    createUser:async(parent,{firstName,lastName,email,password})=>{
        const res=await createUser(firstName,lastName,email,password);
        return res
    }
}

export const resolvers={Query,Mutation}