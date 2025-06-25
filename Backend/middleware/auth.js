import jwt from 'jsonwebtoken';

// Middleware to authenticate any user (user or creator)
export function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Middleware to authenticate only creators
export function authenticateCreator(req, res, next) {
    authenticateToken(req, res, () => {
        if (req.user && req.user.type === 'creator') {
            next();
        } else {
            res.status(403).json({ message: 'Creator access required' });
        }
    });
}

// Alias for routes that expect authenticateJWT as the name
export const authenticateJWT = authenticateToken;
