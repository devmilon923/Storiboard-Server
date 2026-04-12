import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

const secret = process.env.JWT_SECRET_KEY;

const opts: any = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";
passport.use(
  new JwtStrategy(opts, (jwt_payload: any, done: any) => {
    return done(null, jwt_payload);
  }),
);
