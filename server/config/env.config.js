import dotenv from 'dotenv';

dotenv.config({path:'./config/.env'});

export const {SPORT,host,port,database,user,password}=process.env;