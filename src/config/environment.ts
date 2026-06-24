import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 5000;
const ModeEnv = process.env.MODE_ENV || "production";
const DATABASE_URL = process.env.DATABASE_URL || "";
const BCRYPT_SALT=process.env.BCRYPT_SALT || 10;
const JWT_TOKEN_SECRET_KEY = process.env.JWT_TOKEN_SECRET_KEY || "secret";
const JWT_TOKEN_EXPIRES_IN=process.env.JWT_TOKEN_EXPIRES_IN||"15m"
const JWT_TOKEN_EXPIRES_IN_MS=process.env.JWT_TOKEN_EXPIRES_IN_MS||900000
const JWT_REFRESH_SECRET_KEY=process.env.JWT_REFRESH_SECRET_KEY || "secret";
const JWT_REFRESH_TOKEN_EXPIRES_IN=process.env.JWT_REFRESH_TOKEN_EXPIRES_IN||"15d"
const JWT_REFRESH_TOKEN_EXPIRES_IN_MS=process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_MS||1296000000
const RANDOM_BYTES_FOR_PUBLIC_ID=process.env.RANDOM_BYTES_FOR_PUBLIC_ID||16
const environment={
    PORT,
    ModeEnv,
    DATABASE_URL,
    JWT_TOKEN_SECRET_KEY,
    BCRYPT_SALT,
    JWT_REFRESH_SECRET_KEY,
    JWT_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN,
    JWT_TOKEN_EXPIRES_IN_MS,
    JWT_REFRESH_TOKEN_EXPIRES_IN_MS,
    RANDOM_BYTES_FOR_PUBLIC_ID
}

export default environment