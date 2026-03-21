import {neon} from '@neondatabase/serverless'
import dotenv from 'dotenv';
dotenv.config();
console.log("db url is ",process.env.DB_URL);
const sql = neon(process.env.DB_URL as string);
console.log("sql instance is ",sql);

export {sql};