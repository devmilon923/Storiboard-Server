import { Request } from "express";
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";

// 1. Custom function to pull JWT from the cookie
const cookieExtractor = (req: Request) => {
  let token = null;
  console.log(req.cookies);
  if (req && req.cookies) {
    // Replace 'token' with the name you used in res.cookie()
    token = req.cookies["jt"];
  }
  return token;
};

const secret = process.env.JWT_SECRET_KEY;

const opts: any = {
  // 2. Tell Passport to use the cookie instead of the header
  jwtFromRequest: cookieExtractor,
  secretOrKey: secret,
};

passport.use(
  new JwtStrategy(opts, (jwt_payload: any, done: any) => {
    // Passport will now only call this if the cookie token is valid
    return done(null, jwt_payload);
  }),
);
