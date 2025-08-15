import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Express } from "express";

// Super admin credentials (hardcoded as requested)
const SUPER_ADMIN = {
  username: "arif",
  passwordHash: bcrypt.hashSync("UrbanGrid@2023#", 10),
  id: "super-admin",
  firstName: "Arif",
  lastName: "Admin",
  email: "admin@urbangrid.ae",
  role: "admin" as const,
};

export function setupLocalAuth(app: Express) {
  // Local strategy for super admin
  passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      if (username === SUPER_ADMIN.username && bcrypt.compareSync(password, SUPER_ADMIN.passwordHash)) {
        return done(null, {
          claims: {
            sub: SUPER_ADMIN.id,
            email: SUPER_ADMIN.email,
            first_name: SUPER_ADMIN.firstName,
            last_name: SUPER_ADMIN.lastName,
            role: SUPER_ADMIN.role,
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