import dotenv from 'dotenv/config';

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { handleOAuthUser } from '../src/modules/Auth/service.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/${process.env.GOOGLE_CALLBACK_URL}`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const name = profile.displayName || profile.name.givenName;
        const email = profile.emails?.[0]?.value;
        const profileImage = profile.photos[0]?.value;
        const isVerified = profile.emails?.[0]?.verified;
        const providerId = profile.id;
        const provider = profile?.provider.toUpperCase();
        const user = await handleOAuthUser({ name, email, profileImage, isVerified, providerId, provider });
        return done(null, user)
    } catch (error) {
        return done(error, null);
    }
}
))