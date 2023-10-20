export const Query=`#graphql
    loginUser(email:String!,password:String!):String
    getLoggedInUserDetails:User
`;