"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const passport_1 = __importDefault(require("passport"));
const secrets_1 = require("../utils/secrets");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['email', 'profile'],
}));
router.get('/google/redirect', passport_1.default.authenticate('google'), ({ user }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user) {
        res.redirect(secrets_1.UI_URL);
        return;
    }
    let dbUser = yield prisma.user.findFirst({
        where: {
            googleId: user === null || user === void 0 ? void 0 : user.googleId,
        },
    });
    if (!dbUser) {
        dbUser = yield prisma.user.create({
            data: {
                googleId: user.googleId,
                name: user.name,
            },
        });
    }
    const accessToken = (0, secrets_1.generateAccessToken)(Object.assign(Object.assign({}, user), { id: dbUser.id }));
    res.redirect(`${secrets_1.UI_URL}?accessToken=${accessToken}&name=${user.name}`);
}));
router.get('/logout', (req, res) => {
    // TODO this is not proparly loggin out users from google account I think.
    console.log('logging out user');
    req.logout((err) => {
        if (err) {
            console.error('error when logging out', err);
        }
        res.redirect(secrets_1.UI_URL);
    });
});
router.get('/secret', secrets_1.verifyToken, (req, res) => {
    res.json({
        authenticated: true,
        user: req.user,
    });
});
exports.default = router;
