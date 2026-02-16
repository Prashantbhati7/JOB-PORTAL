import app from './app.js';
import { sql } from './utils/db.js';
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();
export const redisClient = createClient({
    url: process.env.REDIS_URL
});
redisClient.connect().then(() => console.log("Redis connected successfully")).catch((error) => console.error("Failed to connect Redis : ", error));
async function initDb() {
    try {
        await sql `
        DO $$
        BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
        END IF;
        END $$;
        `;
        await sql ` CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        role user_role NOT NULL,
        bio TEXT,
        resume VARCHAR(255),
        resume_public_id VARCHAR(255),
        profile_pic VARCHAR(255),
        profile_pic_public_id VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        subscription TIMESTAMPTZ 
        )`;
        await sql ` CREATE TABLE IF NOT EXISTS skills(
        skill_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
        )`;
        await sql ` CREATE TABLE IF NOT EXISTS user_skills(
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        skill_id INTEGER NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, skill_id)
        )`;
        console.log("Database initialized successfully");
    }
    catch (err) {
        console.log("Error in initializing database ", err);
    }
}
initDb().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log("auth service is running on PORT ", PORT);
    });
});
