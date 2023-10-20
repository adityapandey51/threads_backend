import { ApolloServer } from "@apollo/server";
import { User } from "./users/index.js";

async function createApolloGraphqlServer(){
    //    creating graphql server
    const server=new ApolloServer({
        typeDefs:`
            ${User.typeDefs}
            type Query{
               ${User.Query}
            }
            type Mutation{
                ${User.Mutation}
            }`,
           
        resolvers:{
            Query:{
                ...User.resolvers.Query
            },
            Mutation:{
               ...User.resolvers.Mutation
            }
           
        }

    })
    // starting the server
    await server.start()

    return server
}

export default createApolloGraphqlServer