import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

export const {
    SPORT,
    host,
    port,
    database,
    user,
    password,
    refreshsecret,
    refreshexpirein,
    accesssecret,
    accessexpirein,
    redishost,
    redisHost,
    redisPort
} = process.env;
