import {pool,initilization} from './database/db.sql.js'
import {SPORT} from './config/env.config.js';
import errorMiddleware from './middleware/error.middleware.js';
import express from 'express';
import authRouter from './router/auth.router.js'
import cookieParser from 'cookie-parser';
import { redisClient } from "./config/redis.js";
import helmet from 'helmet'
import limiter from './middleware/limiter.middleware.js';

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(limiter);
app.use('/api',authRouter);

app.get(['/apihealth', '/api/health', '/api/apihealth'],(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Server Running"
    })
});

app.get(["/dbhealth", "/api/dbhealth"],async(req,res)=>{
    try{
        const result = await pool.query("SELECT id, email FROM users");
     

        res.status(200).json({
            success:true,
            data:result.rows
            
        })
    }catch(e){
        console.log(e);
        res.status(500).json({ success: false, error: e.message });
    }
})

app.get("/redis-test", async (req, res) => {
    try {
        await redisClient.set("username", "Vijay");
        const name = await redisClient.get("username");

        res.json({
            success: true,
            username: name
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use(errorMiddleware);

const port = SPORT || 5000;
const startServer=async()=>{
    try{
        await initilization();
        await redisClient.connect();
        app.listen(port,()=>{
            console.log(`Server Running in http://localhost:${port}`)
            console.log(`Health Check in http://localhost:${port}/apihealth`)
            console.log(`Database Health in http://localhost:${port}/dbhealth`)
        })
    }catch(e){
        console.log("Server Down:", e.message);
        process.exit(1);
    }
}
startServer();
const shutdown = async () => {
    console.log("Shutting down gracefully...");
    await pool.end();
    await redisClient.quit();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
