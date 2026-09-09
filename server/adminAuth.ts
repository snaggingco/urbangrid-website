import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express } from "express";

export function setupLocalAuth(app: Express) {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPasswordHash = process.env.ADMIN_PASSWORD
    ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12)
    : null;

  if (!adminPasswordHash) {
    console.warn("ADMIN_PASSWORD is not configured; local admin login is disabled.");
  }

  const PgSessionStore = connectPg(session);
  const sessionStore = new PgSessionStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    tableName: "sessions",
  });

  // Setup session middleware for passport
  app.use(session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: "urbangrid.sid",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    },
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user for session storage
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Local strategy for super admin
  passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      if (
        adminPasswordHash &&
        username === adminUsername &&
        bcrypt.compareSync(password, adminPasswordHash)
      ) {
        return done(null, {
          claims: {
            sub: "super-admin",
            email: process.env.ADMIN_EMAIL || "admin@urbangrid.ae",
            first_name: "UrbanGrid",
            last_name: "Administrator",
            role: "admin",
          }
        });
      }
      return done(null, false, { message: 'Invalid credentials' });
    } catch (error) {
      return done(error);
    }
  }));

  // Admin login routes
  app.post('/api/admin/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login?error=1',
    failureFlash: false
  }));

  app.get('/api/admin/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/');
    });
  });

  app.get('/api/admin/login', (req, res) => {
    const error = req.query.error;
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Login - UrbanGrid</title>
        <style>
          body { font-family: Inter, sans-serif; background: #f9fafb; margin: 0; padding: 2rem; }
          .container { max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .logo { color: #064E3B; font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 2rem; }
          .form-group { margin-bottom: 1rem; }
          label { display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500; }
          input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
          input:focus { outline: none; border-color: #064E3B; box-shadow: 0 0 0 3px rgba(6, 78, 59, 0.1); }
          button { width: 100%; background: #064E3B; color: white; padding: 0.75rem; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; }
          button:hover { background: #065f46; }
          .error { color: #dc2626; margin-bottom: 1rem; padding: 0.5rem; background: #fee2e2; border-radius: 4px; }
          .back-link { text-align: center; margin-top: 1rem; }
          .back-link a { color: #064E3B; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">UrbanGrid</div>
          <h2 style="text-align: center; margin-bottom: 2rem; color: #374151;">Admin Login</h2>
          ${error ? '<div class="error">Invalid username or password</div>' : ''}
          <form method="POST" action="/api/admin/login">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Login</button>
          </form>
          <div class="back-link">
            <a href="/">← Back to Website</a>
          </div>
        </div>
      </body>
      </html>
    `);
  });
}