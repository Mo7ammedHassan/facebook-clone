import generateToken from "./generate-token";
import environment from "../config/environment";

interface AuthTokens {
  token: string;
  refreshToken: string;
  expireAt: Date;
}

// const JWT_EXPIRES = "10m";
// const REFRESH_TOKEN_EXPIRES = "7d";

const createAuthTokens = async (userId: number): Promise<AuthTokens> => {
  const token = generateToken( // Access Token
    userId,
    environment.JWT_TOKEN_SECRET_KEY,
    environment.JWT_TOKEN_EXPIRES_IN,
  );
  const expireAt = new Date(Date.now() + +environment.JWT_TOKEN_EXPIRES_IN_MS);

  const refreshToken = generateToken( // Refresh Token
    userId,
    environment.JWT_REFRESH_SECRET_KEY,
    environment.JWT_REFRESH_TOKEN_EXPIRES_IN,
  );

  return { token, refreshToken, expireAt };
};

export default createAuthTokens;
