import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import { Request } from "express";

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

const secret = process.env.JWT_SECRET_KEY;

const opts: any = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: secret,
};
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";
passport.use(
  new JwtStrategy(opts, (jwt_payload: any, done: any) => {
    return done(null, jwt_payload);
  }),
);
