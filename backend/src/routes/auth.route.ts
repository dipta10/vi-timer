import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { UI_URL, generateAccessToken, verifyToken } from '../utils/secrets';

const router = express.Router();
const prisma = new PrismaClient();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

router.get(
  '/google/redirect',
  passport.authenticate('google'),
  async ({ user }, res) => {
    if (!user) {
      res.redirect(UI_URL);
      return;
    }

    let dbUser = await prisma.user.findFirst({
      where: {
        googleId: user?.googleId,
      },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          googleId: user.googleId,
          name: user.name,
        },
      });
    }

    const accessToken = generateAccessToken({
      ...user,
      id: dbUser.id,
    });

    res.redirect(`${UI_URL}?accessToken=${accessToken}&name=${user.name}`);
  },
);

router.get('/logout', (req: Request, res: Response) => {
  // TODO this is not proparly loggin out users from google account I think.
  console.log('logging out user');
  req.logout((err) => {
    if (err) {
      console.error('error when logging out', err);
    }
    res.redirect(UI_URL);
  });
});

router.get('/secret', verifyToken, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user,
  });
});

export default router;
