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

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface logginInput {
  email: string;
  password: string;
}

interface logoutInput {
  refreshToken: string;
}

class Servervices {
  // Register a new user
  register = async ({ name, email, password }: RegisterInput) => {
    const registerInput = await User.findOne({ email });
    if (registerInput) {
      throw new Error("Email Already Exists");
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
      refreshTokenHash: refreshTokenHash,
      deviceId: crypto.randomUUID(),
      deviceName: "Unknwon Device",
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
  };

  // Log in an existing user
  login = async ({ email, password }: logginInput) => {
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

    const refershTokenhash = hashRefreshToken(refreshToken);

    await Refershtoken.create({
      userId: user._id,
      refreshTokenHash: refershTokenhash,
      deviceId: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return {
      data: {
        id: user._id,
        name: user.name,
        emal: user.email,
      },
      accessToken,
      refreshToken,
    };
  };

  logout = async ({ refreshToken }: logoutInput) => {
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
      message: "loggedOut Successfully",
    };
  };

  refresh = async ({ refreshToken }: logoutInput) => {
    const payload = verifyRefreshToken(refreshToken);
    const refreshTokenHash = hashRefreshToken(refreshToken);
    const existingToken = await Refershtoken.findOne({
      refreshTokenHash,
    });

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
  };

  logoutAll = async (userId: string) => {
    const result = await Refershtoken.deleteMany({
      userId,
    });

    return {
      deletedSessions: result.deletedCount,
    };
  };

  profile = async (currentUser: string) => {
    const user = await User.findById(currentUser);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      name: user.name,
      email: user.email,
    };
  };
}

export default new Servervices();
