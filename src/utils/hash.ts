import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 10;

/**
 * Hash user password
 */
export const hashPassword = async (
  password: string
): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plain password with hash
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Hash refresh token using SHA-256
 */
export const hashRefreshToken = (
  refreshToken: string
): string => {
  return crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
};