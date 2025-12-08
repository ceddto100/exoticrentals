import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const requireEnv = (key, fallback) => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const configurePassport = () => {
  const callbackURL = requireEnv(
    'GOOGLE_CALLBACK_URL',
    `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`
  );

  const googleOptions = {
    clientID: requireEnv('GOOGLE_CLIENT_ID'),
    clientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
    callbackURL,
  };

  passport.use(
    new GoogleStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails, displayName, _json } = profile;
        const email = emails?.[0]?.value;

        if (!email) {
          return done(new Error('Google profile did not return an email'), null);
        }

        let user = await User.findOne({ $or: [{ googleId: id }, { email }] });

        if (!user) {
          user = new User({
            googleId: id,
            email,
            name: displayName || email,
            avatarUrl: _json?.picture || null,
          });
        } else {
          user.googleId = user.googleId || id;
          if (!_json?.picture && !user.avatarUrl) {
            user.avatarUrl = null;
          } else if (_json?.picture) {
            user.avatarUrl = _json.picture;
          }
        }

        const adminRecord = await Admin.findOne({ email });

        user.role = adminRecord ? 'admin' : 'customer';
        user.lastLogin = new Date();
        await user.save();

        if (user.role === 'admin' && adminRecord && (!adminRecord.user || adminRecord.user.toString() !== user._id.toString())) {
          adminRecord.user = user._id;
          await adminRecord.save();
        }

        return done(null, user);
      } catch (error) {
        console.error('Error in Google OAuth Strategy:', error);
        return done(error, null);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;
