import passport from 'passport';
import passportGoogle, {
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../utils/secrets';

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8000/auth/google/redirect',
      // callbackURL: 'http://localhost:3000/',
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      // TODO get and set profile details in DB
      done(null, {
        googleId: profile.id,
        name: profile.displayName,
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  done(null, user as any);
});
