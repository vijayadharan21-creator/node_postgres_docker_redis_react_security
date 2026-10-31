import {pool,initilization} from './database/db.sql.js'
import {SPORT} from './config/env.config.js'
import express from 'express';

const app=express();



app.get('/apihealth',(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Server Running"
    })
});
app.get("/dbhealth",async(req,res)=>{
    try{
        const result=await pool.query("Select * from test");
     

        res.status(201).json({
            success:true,
            data:result.rows
            
        })
    }catch(e){
        console.log(e)
    }

})
const startServer=async()=>{
    await initilization();
    app.listen(SPORT,()=>{
        console.log("Server Running in http://localhost:3000/dbhealth")
    })
}
startServer();