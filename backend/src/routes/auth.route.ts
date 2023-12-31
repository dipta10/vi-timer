import express, { Request, Response } from 'express';
import passport from 'passport';
import { generateAccessToken, verifyToken } from '../utils/secrets';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  const { user } = req;
  const userInfo = {
    id: (user as any).id,
    name: (user as any).displayName,
  };
  const accessToken = generateAccessToken(userInfo);

  // TODO: Here sign user up!
  res.redirect(`http://localhost:3000?token=${accessToken}`);
});

router.get('/logout', (req: Request, res: Response) => {
  // TODO implement logout
  req.logout((err) => {
    if (err) {
      console.error('error when logging out', err);
    }
    res.redirect('/');
  });
});

router.get('/secret', verifyToken, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user,
  });
});

export default router;
