import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const googleId = profile.id;
          if (!email) {
            return done(new Error('No email returned from Google'));
          }

          let user = await User.findOne({ googleId });
          if (!user) {
            user = await User.create({
              googleId,
              email,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value,
              role: 'customer',
            });
          }

          if (user.role === 'admin') {
            await Admin.findOneAndUpdate(
              { user: user._id },
              { user: user._id, permissions: ['manage_users', 'manage_fleet'] },
              { upsert: true, new: true }
            );
          }

          return done(null, user);
        } catch (err) {
          return done(err, undefined);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
