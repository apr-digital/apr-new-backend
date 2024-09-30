const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mydb = require('../config/dbconfig');

const GOOGLE_CLIENT_ID = '929643240533-gnj5bog0m3jb3kh1qkb51ip7u845de11.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: '929643240533-gnj5bog0m3jb3kh1qkb51ip7u845de11.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "https://apr-marathon-render.onrender.com/api/registrant/auth/google/callback",
    passReqToCallback: true,
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }));


// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser(async (user.id, done) => {
//     try {
//         const user = await mydb.findUserById(user.id);
//         done(null, user);
//     } catch (error) {
//         done(error);
//     }
// });

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});