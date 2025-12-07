import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const configurePassport = () => {
  const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
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
            name: displayName,
            avatarUrl: _json.picture,
          });
        }

        const adminRecord = await Admin.findOne({ email });
        user.role = adminRecord ? 'admin' : 'customer';

        user.lastLogin = new Date();
        await user.save();

        if (user.role === 'admin' && adminRecord) {
          adminRecord.user = user._id;
          await adminRecord.save();
        }

        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        user.token = token;

        return done(null, user);
      } catch (error) {
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
