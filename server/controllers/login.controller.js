import {pool} from '../database/db.sql.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from "../utils/Apperror.js"
import {refreshToken,accessToken} from '../services/token.js'
import { refreshsecret } from '../config/env.config.js';


export const registerUser=async(req,res,next)=>{
    try{
        
        const{email,password}=req.body
        
        const userExist=await pool.query("Select * from users where email=$1",[email]);
        if(userExist.rowCount!=0){
                throw new AppError("User Already Exist", 409);
            };
        const salt=await bcrypt.genSalt(10);
        const hpassword=await bcrypt.hash(password,salt);

        const user=await pool.query("insert into users(email,password)values($1,$2) returning id,email",[email,hpassword]);
        const accToken=accessToken(user.rows[0]);
        const refToken=refreshToken(user.rows[0]);
        res.cookie("accessToken",accToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production"?true:false,
            sameSite:'lax',
            maxAge:1000*60*15
        })

        res.cookie("refreshToken",refToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production"?true:false,
            sameSite:'lax',
            maxAge:1000*60*60*24*7
        })
        await pool.query("update users set refreshtoken=$1 where email=$2",[refToken,email]);
        
        res.status(201).json({
            success:true,
            message:"User Created Successfully",
            User:user.rows[0],
            })


    }catch(e){
        next(e)
    }
}

export const loginUser =async(req,res,next)=>{
    try{
        const{email,password}=req.body;

        const user=await pool.query("select * from users where email=$1 ",[email]);
        if(user.rowCount==0){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        };

        const result=await bcrypt.compare(password,user.rows[0].password);
        if(!result){
            return res.status(401).json({
                success:false,
                message:"Invalid Password"
            })
        };

        const accToken=accessToken(user.rows[0]);
        const refToken=refreshToken(user.rows[0]);
        res.cookie("accessToken",accToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production"?true:false,
            sameSite:'lax',
            maxAge:1000*60*15
        })

        res.cookie("refreshToken",refToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production"?true:false,
            sameSite:'lax',
            maxAge:1000*60*60*24*7
        })
        await pool.query("update users set refreshtoken=$1 where email=$2",[refToken,email]);
        const{id}=user.rows[0];
        res.status(200).json({
            success:true,
            message:"Login Successful",
            User:{
                email,
                id:id
            }
        })


    }catch(e){
        next(e)
    }
}

// Generate new access token using refresh tokenexport
 const refreshAccessToken = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ success: false, message: "No refresh token provided" });
        }

        const decoded = jwt.verify(token, refreshsecret);

        const user = await pool.query("SELECT id, email, refreshtoken FROM users WHERE id = $1", [decoded.id]);
        if (user.rowCount === 0 || user.rows[0].refreshtoken !== token) {
            return res.status(403).json({ success: false, message: "Invalid refresh token" });
        }

        // 1. Generate fresh accessToken (15m)
        const accToken = accessToken(user.rows[0]);

        // 2. SLIDING SESSION: Generate fresh refreshToken (resets the 7-day clock!)
        const newRefToken = refreshToken(user.rows[0]);

        // 3. Save new refreshToken to database
        await pool.query("UPDATE users SET refreshtoken = $1 WHERE id = $2", [newRefToken, user.rows[0].id]);

        // 4. Send updated cookies
        res.cookie("accessToken", accToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 15 // 15 mins
        });

        res.cookie("refreshToken", newRefToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7 // Fresh 7 days from now
        });

        res.status(200).json({
            success: true,
            message: "Tokens refreshed successfully",
            accessToken: accToken
        });
    } catch (e) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    }
};