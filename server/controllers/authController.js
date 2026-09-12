import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { populateUserEquipped } from './equipController.js';

const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET || 'cozy_lofi_study_room_jwt_access_secret_2024',
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'cozy_lofi_study_room_jwt_refresh_secret_2024',
    { expiresIn: '7d' }
  );
};

const setRefreshTokenCookie = (res, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

const formatUserResponse = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role || 'user',
  level: user.level,
  currentXP: user.currentXP,
  xpToNextLevel: user.xpToNextLevel,
  cozyCoins: user.cozyCoins,
  skills: user.skills,
  streak: user.streak,
  inventory: user.inventory,
  equipped: user.equipped || {
    hair: null,
    chest: null,
    pants: null,
    shoes: null,
    weapon: null,
    aura: null,
  },
});

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
      return res.status(400).json({
        success: false,
        message: `${field} is already taken. Please choose another.`,
      });
    }

    const user = new User({
      username,
      email: email.toLowerCase(),
      passwordHash: password,
      role: 'user',
      level: 1,
      currentXP: 0,
      cozyCoins: 60,
      skills: {
        intellect: 10,
        vitality: 10,
        discipline: 10,
        creativity: 10,
      },
      streak: {
        count: 0,
        lastCompletedDate: null,
      },
      inventory: [],
      equipped: {
        hair: null,
        chest: null,
        pants: null,
        shoes: null,
        weapon: null,
        aura: null,
      },
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const salt = await bcrypt.genSalt(10);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, salt);

    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      message: 'Agent commissioned successfully.',
      accessToken,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const salt = await bcrypt.genSalt(10);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    const populatedUser = await populateUserEquipped(User.findById(user._id));

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.username}!`,
      accessToken,
      user: formatUserResponse(populatedUser),
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'cozy_lofi_study_room_jwt_refresh_secret_2024'
      );
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired or invalid, please log in again',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({
        success: false,
        message: 'User session expired',
      });
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isRefreshTokenValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    const salt = await bcrypt.genSalt(10);
    user.refreshTokenHash = await bcrypt.hash(newRefreshToken, salt);
    await user.save();

    setRefreshTokenCookie(res, newRefreshToken);

    const populatedUser = await populateUserEquipped(User.findById(user._id));

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: formatUserResponse(populatedUser),
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET || 'cozy_lofi_study_room_jwt_refresh_secret_2024'
        );
        await User.findByIdAndUpdate(decoded.id, { refreshTokenHash: null });
      } catch {
        // token was expired or invalid
      }
    }

    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};
