"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateAccessToken = exports.BACKEND_URL = exports.UI_URL = exports.COOKIE_KEY = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.PORT = exports.PRODUCTION = exports.ENVIRONMENT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.ENVIRONMENT = process.env.NODE_ENV;
exports.PRODUCTION = exports.ENVIRONMENT === 'production';
exports.PORT = (process.env.PORT || 3000);
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
exports.COOKIE_KEY = process.env.COOKIE_KEY || '';
exports.UI_URL = process.env.UI_URL;
exports.BACKEND_URL = process.env.BACKEND_URL;
const generateAccessToken = (user) => {
    if (!user)
        return '';
    return jsonwebtoken_1.default.sign(user, 'my-secret-key', { expiresIn: '1h' });
};
exports.generateAccessToken = generateAccessToken;
const verifyToken = (req, res, next) => {
    const barrierToken = req.headers.authorization;
    if (!barrierToken) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    jsonwebtoken_1.default.verify(barrierToken.split(' ')[1], 'my-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        req.user = decoded; // Attach the user to the request object
        next();
    });
};
exports.verifyToken = verifyToken;
