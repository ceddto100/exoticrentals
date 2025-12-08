
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
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

        // Find an existing user by Google ID or email
        let user = await User.findOne({ $or: [{ googleId: id }, { email }] });

        // If no user exists, create a new one
        if (!user) {
          user = new User({
            googleId: id,
            email,
            name: displayName,
            avatarUrl: _json.picture, // Get avatar from Google profile
          });
        }

        // --- ADMIN ROLE VERIFICATION ---
        // This is the critical security check. It verifies if the user's email
        // is registered in the separate 'Admin' collection.
        const adminRecord = await Admin.findOne({ email });
        
        if (adminRecord) {
          user.role = 'admin';
        } else {
          user.role = 'customer';
        }
        // --- END OF SECURITY CHECK ---

        user.lastLogin = new Date();
        await user.save();

        // For data consistency, link the Admin record to the User record if they are an admin.
        if (user.role === 'admin' && adminRecord && adminRecord.user !== user._id) {
          adminRecord.user = user._id;
          await adminRecord.save();
        }

        // Pass the hydrated user object to the googleCallback controller.
        // The controller is responsible for generating the JWT.
        return done(null, user);

      } catch (error) {
        console.error('Error in Google OAuth Strategy:', error);
        return done(error, null);
      }
    })
  );

  // Serialization/deserialization is not strictly necessary for stateless JWT sessions
  // but is included for completeness and potential future use cases.
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
