import bcrypt from "bcrypt";
import AppError from "../../../utils/app-error";
import createAuthTokens from "../../../utils/auth-tokens";
import hashRefreshToken from "../../../utils/hash-refresh-token";
import UserRepository from "../../../Repositories/user.repo";
import LoginSessionRepository from "../../../Repositories/login-session.Repo";

const userRepo = new UserRepository();
const loginSessionRepo = new LoginSessionRepository();
const loginUser = async (email: string, password: string) => {
  
  const user = await userRepo.findByEmail(email);

  if (!user) {
    throw new AppError("User not found", 400);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError("Invalid password", 400);
  }

  const { token, refreshToken, expireAt } = await createAuthTokens(user.id);

  const hashedRefreshToken = hashRefreshToken(refreshToken);

  await loginSessionRepo.create({
    refreshToken: hashedRefreshToken,
    expireAt,
    userId: user.id,
  });

  return { token, refreshToken, expireAt, user };
};

export default loginUser;
