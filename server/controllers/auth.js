import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import users from '../models/auth.js';
import sendResetPasswordEmail from '../utils/mailer.js';
import useragent from 'express-useragent';


export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await users.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

   
    const userAgent = req.useragent;
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);

    
    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0];
    }

    const loginInfo = {
      timestamp: new Date(),
      ip,
      browser: userAgent.browser,
      os: userAgent.os,
      device: userAgent.isMobile ? 'Mobile' : 'Desktop',
    };

   
    newUser.loginHistory = [loginInfo];
    await newUser.save();

    res.status(200).json({ result: newUser, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Something went wrong...' });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User does not exist.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    
    const userAgent = req.useragent;
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);

  
    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0];
    }

    const loginInfo = {
      timestamp: new Date(),
      ip,
      browser: userAgent.browser,
      os: userAgent.os,
      device: userAgent.isMobile ? 'Mobile' : 'Desktop',
    };

   
    existingUser.loginHistory.push(loginInfo);
    await existingUser.save();

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong...' });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 12);
    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendResetPasswordEmail(user.email, resetToken);

    res.status(200).json({ message: 'Password reset link has been sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Something went wrong...' });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await users.findOne({
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Something went wrong...' });
  }
};


export const getLoginHistory = async (req, res) => {
  try {
    const user = await users.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.loginHistory);
  } catch (error) {
    console.error('Get login history error:', error);
    res.status(500).json({ message: 'Something went wrong...' });
  }
};
