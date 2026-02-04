import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import type { StringValue } from 'ms';

const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
  });
};

const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue,
  });
};

export const register = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        messgae: 'Name, email or password is missing',
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        messgae: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        accessToken,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Email or password is missing');
    }
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid password');
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      data: {
        accessToken,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const refreshAccessToken = async (req: any, res: any) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw new Error('User id is missing');
    }

    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new Error('Refresh token is missing');
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isRefreshTokenCorrect = await bcrypt.compare(
      refreshToken,
      user.refreshToken as string,
    );

    if (!isRefreshTokenCorrect) {
      throw new Error('Refresh token is invalid');
    }

    const accessToken = generateAccessToken(user.id);

    res.status(200).json({
      staus: 'success',
      message: 'Access token refreshed successfully',
      data: {
        accessToken,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const logout = async (req: any, res: any) => {
  try {
    res.clearCookie('refreshToken');

    res.status(200).json({
      status: 'success',
      message: 'User logged out successfully',
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const authenticateUser = async (req: any, res: any, next: any) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as { userId: number };

    req.user = { id: decoded.userId };
    next();
  } catch (err: any) {
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
    });
  }
};
