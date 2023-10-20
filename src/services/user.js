import prisma from "../lib/DB/db.config.js"
import {createHmac,randomBytes} from "node:crypto"
import JWT from "jsonwebtoken"

const generateHash=(password,salt)=>{
    return createHmac('sha256',salt).update(password).digest('hex');
}

export const createUser=async(firstName,lastName,email,password)=>{
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    const isEmail=regexExp.test(email); 

    if (!isEmail)throw new Error ('not valid email')


    try {
        const salt=randomBytes(32).toString("hex");
        const hashedPassword=generateHash(password,salt)
       const user=await prisma.user.create({
        data:{
            firstName,
            lastName,
            email,
            hash:salt,
            password:hashedPassword
        }
       })
       return user.id
    } catch (error) {
        return "error in the server"
    }
}



export const loginUser=async(email,password)=>{
    try {
        const user=await prisma.user.findFirst({
            where:{
                email
            }
        })
        if (!user) throw new Error('user not found')

        const salt=user.hash;

        const hashedPassword=generateHash(password,salt)
        if (hashedPassword!==user.password){
            throw new Error ('invalid credentials')
        }

        const token =JWT.sign({id:user.id,email:user.email},process.env.JWT_SECRET);
        return token


    } catch (error) {
        return "problem in the server"
    }
}

export const decodeJwt=(token)=>{
    return  JWT.verify(token,process.env.JWT_SECRET)
}
export const fetchUserById=async(id)=>{
    const user=await prisma.user.findUnique({
        where:{
            id
        }
    })
    return user
}