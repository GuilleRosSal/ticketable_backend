import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '16h' });
};

export const authenticateToken = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No autorizado.' });
  }

  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Sesión caducada.' });
      }

      return res.status(403).json({ error: 'Acceso restringido.' });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  });
};

//Secondary middleware to ensure user is an ADMIN. Use only when method authenticateToken() has been previously called
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso restringido.' });
  }
};

//Secondary middleware to ensure user is a CLIENT. Use only when method authenticateToken() has been previously called
export const isClient = (req, res, next) => {
  if (req.user && req.user.role === 'CLIENT') {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso restringido.' });
  }
};

//Secondary middleware to ensure the user accessing or updating user data is the one logged in. Use only when methods authenticateToken() and validateUserId() have been previously called
export const isOwnerViaIdParam = (req, res, next) => {
  if (req.user && req.userId && req.user.id === req.userId) {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso restringido.' });
  }
};
