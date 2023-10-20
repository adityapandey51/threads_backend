import express from "express";
import createApolloGraphqlServer from "../graphql/index.js";
import {expressMiddleware} from "@apollo/server/express4";
import dotenv from "dotenv";
import { decodeJwt } from "../services/user.js";
dotenv.config();


const init=async()=>{
    const app=express();
    app.use(express.json());
    const PORT=Number(process.env.PORT) ||8080;

    // exposing it to the port
    app.use("/graphql",expressMiddleware(await createApolloGraphqlServer(),{context:async({req})=>{
        const token=req.headers.token
        
        try {
            const user=decodeJwt(token)
            return {user}
        } catch (error) {
            return {}
        }
        
    }}));

    app.get("/",(req,res)=>{
        res.json({message:"server is up and running"})
    })

    app.listen(PORT,()=>{
        console.log(`server started on port ${PORT}`)
    })
}

init()











