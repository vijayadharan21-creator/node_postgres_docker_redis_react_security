import jwt from "jsonwebtoken";
import { refreshexpirein,refreshsecret ,accessexpirein,accesssecret} from "../config/env.config.js";

export const refreshToken=(user)=>{
    return jwt.sign({
        email:user.email,
        id:user.id
    },refreshsecret,{
        expiresIn:refreshexpirein
    }
)
}

export const accessToken=(user)=>{
    return jwt.sign({
        email:user.email,
        id:user.id
    },accesssecret,{
        expiresIn:  accessexpirein
    })
}
