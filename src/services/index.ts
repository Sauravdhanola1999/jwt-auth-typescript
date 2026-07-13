import User from "../models/User.js";
import {
  comparePassword,
  hashPassword,
  hashRefreshToken,
} from "../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import Refershtoken from "../models/Refershtoken.js";
import crypto from "crypto";
import redisClient from "../config/redis.js";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LogoutInput {
  refreshToken: string;
}

export interface IAuthService {
  register(input: RegisterInput): Promise<any>;
  login(input: LoginInput): Promise<any>;
  logout(input: LogoutInput): Promise<any>;
  refresh(input: LogoutInput): Promise<any>;
  logoutAll(userId: string): Promise<any>;
  profile(currentUser: string): Promise<any>;
  profiles(): Promise<any>;
}

export class Services implements IAuthService {
  public async register({ name, email, password }: RegisterInput) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshTokenHash = hashRefreshToken(refreshToken);
    await Refershtoken.create({
      userId: user._id,
      refreshTokenHash,
      deviceId: crypto.randomUUID(),
      deviceName: "Unknown Device",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  public async login({ email, password }: LoginInput) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshTokenHash = hashRefreshToken(refreshToken);

    await Refershtoken.create({
      userId: user._id,
      refreshTokenHash,
      deviceId: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  public async logout({ refreshToken }: LogoutInput) {
    verifyRefreshToken(refreshToken);

    const refreshTokenHash = hashRefreshToken(refreshToken);
    const token = await Refershtoken.findOne({ refreshTokenHash });

    if (!token) {
      throw new Error("Invalid refresh token");
    }

    await Refershtoken.deleteOne({
      _id: token._id,
    });

    return {
      message: "Logged out successfully",
    };
  }

  public async refresh({ refreshToken }: LogoutInput) {
    const payload = verifyRefreshToken(refreshToken);
    const refreshTokenHash = hashRefreshToken(refreshToken);
    const existingToken = await Refershtoken.findOne({ refreshTokenHash });

    if (!existingToken) {
      throw new Error("Invalid refresh token");
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await Refershtoken.deleteOne({
      _id: existingToken._id,
    });

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    await Refershtoken.create({
      userId: user._id,
      refreshTokenHash: newRefreshTokenHash,
      deviceId: existingToken.deviceId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  public async logoutAll(userId: string) {
    const result = await Refershtoken.deleteMany({ userId });

    return {
      deletedSessions: result.deletedCount,
    };
  }

  public async profile(currentUser: string) {
    const user = await User.findById(currentUser);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      name: user.name,
      email: user.email,
    };
  }

  public async profiles() {
    const cachedUsers = await redisClient.get("users");

    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    }

    const users = await User.find();
    const mappedUsers = users.map((user) => ({
      name: user.name,
      email: user.email,
    }));

    await redisClient.set("users", JSON.stringify(mappedUsers), {
      EX: 300,
    });

    return mappedUsers;
  }
}

export const authService = new Services();
