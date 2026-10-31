
import {Pool} from 'pg';
import {host,port,database,user,password} from '../config/env.config.js'

export const pool =new Pool({
    host:host,
    port: Number(port),
    database:database,
    user: user,
    password:password,
})

export const initilization=async()=>{
    try{
        await pool.query("CREATE TABLE IF NOT EXISTS test(name text)")
        await pool.query("insert into test(name)values($1)",["vijay"]);
    }catch(e){
        console.log(e.message);
    }
}