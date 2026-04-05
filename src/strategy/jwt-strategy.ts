import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

var opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";

passport.use(
  new JwtStrategy(opts, (jwt_payload: any, done: any) => {
    done(null, jwt_payload);
  }),
);
