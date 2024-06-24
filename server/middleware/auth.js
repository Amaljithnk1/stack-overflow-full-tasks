import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Token missing' });
    }

    try {
      if (token.startsWith('resetPasswordToken_')) {
        const decodedData = jwt.verify(token.slice(18), process.env.RESET_PASSWORD_SECRET);
        req.resetPasswordToken = decodedData.token;
        req.userId = decodedData.id;
        console.log('Reset password token verified:', decodedData);
      } else {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData.id;
      }
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default auth;
