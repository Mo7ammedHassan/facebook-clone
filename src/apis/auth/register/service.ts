import bcrypt from "bcrypt";
import crypto from "crypto";
import AppError from "../../../utils/app-error";
import environment from "../../../config/environment";
import createAuthTokens from "../../../utils/auth-tokens";
import { createPublicId } from "../../../utils/create-public-id";
import UserRepository from "../../../Repositories/user.repo";
import LoginSessionRepository from "../../../Repositories/login-session.Repo";
import ProfileRepository from "../../../Repositories/profile.repository";

const userRepo = new UserRepository();
const loginSessionRepo = new LoginSessionRepository();
const profileRepo = new ProfileRepository();

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  DateOfBirthStr: string,
  confirmPassword: string,
) => {
  const isUserExists = await userRepo.existsByEmail(email);
  if (isUserExists) {
    throw new AppError("User already exists", 400);
  }

  const dateOfBirth = new Date(DateOfBirthStr);

  if (isNaN(dateOfBirth.getTime())) {
    throw new AppError("Invalid date format. Please use YYYY-MM-DD", 400);
  }

  if(password !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }

  const passwordHash = await bcrypt.hash(password, +environment.BCRYPT_SALT);

  let publicId = createPublicId();

  while (await userRepo.publicIdExists(publicId)) {
    publicId = createPublicId();
  }

  const newUser = await userRepo.createUser({
    email,
    passwordHash,
    name,
    publicId,
  });


  const userId = newUser.id;

  let { token, refreshToken, expireAt } = await createAuthTokens(userId);
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await loginSessionRepo.create({
    refreshToken: hashedRefreshToken,
    expireAt,
    userId,
  });


  // 5. ميزة الفيسبوك: إنشاء البروفايل تلقائياً لليوزر الجديد
  await profileRepo.createProfileForUser(userId, dateOfBirth);

  return { token, refreshToken, expireAt, user: newUser };
};
