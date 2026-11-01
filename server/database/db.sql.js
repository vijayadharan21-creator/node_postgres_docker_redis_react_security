import {Pool} from 'pg';
import {host,port,database,user,password} from '../config/env.config.js';

export const pool = new Pool({
    host: host,
    port: Number(port),
    database: database,
    user: user,
    password: password,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle pg client:', err.message);
});

export const initilization = async () => {
    try {
        await pool.query("CREATE TABLE IF NOT EXISTS users(id serial primary key, email text unique not null, password text not null, refreshtoken text);");
    } catch(e) {
        console.log("Database initialization error:", e.message);
    }
};
