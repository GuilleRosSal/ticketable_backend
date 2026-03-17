import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
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

    next();
  });
};
