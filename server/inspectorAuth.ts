import { Express } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { Inspector } from "@shared/schema";

// Initialize inspector with default account
const initializeDefaultInspector = async () => {
  try {
    const existing = await storage.getInspectorByUsername("shahbas");
    if (!existing) {
      const hashedPassword = bcrypt.hashSync("Shahbas@123#", 10);
      await storage.createInspector({
        username: "shahbas",
        passwordHash: hashedPassword,
        fullName: "Shahbas Inspector",
        email: "shahbas@urbangrid.ae",
        phone: "+971585686852",
        isActive: true,
      });
      console.log("Default inspector account created: shahbas");
    }
  } catch (error) {
    console.error("Error creating default inspector:", error);
  }
};

export function setupInspectorAuth(app: Express) {
  // Initialize default inspector account
  initializeDefaultInspector();

  // Inspector local strategy
  passport.use('inspector-local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      const inspector = await storage.getInspectorByUsername(username);
      
      if (!inspector) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      if (!inspector.isActive) {
        return done(null, false, { message: 'Account deactivated' });
      }

      if (!bcrypt.compareSync(password, inspector.passwordHash)) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, {
        type: 'inspector',
        claims: {
          sub: inspector.id.toString(),
          email: inspector.email,
          username: inspector.username,
          full_name: inspector.fullName,
          role: 'inspector',
        }
      });
    } catch (error) {
      return done(error);
    }
  }));

  // Inspector login routes
  app.post('/api/inspector/login', passport.authenticate('inspector-local'), 
    (req, res) => {
      res.json({ 
        success: true, 
        redirectUrl: 'https://urbangrid-snagging.replit.app',
        user: req.user
      });
    }
  );

  app.post('/api/inspector/logout', (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  // Inspector login page route
  app.get('/inspector/login', (req, res) => {
    const error = req.query.error;
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Inspector Login - UrbanGrid</title>
        <style>
          body { font-family: Inter, sans-serif; background: #f9fafb; margin: 0; padding: 2rem; }
          .container { max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .logo { color: #064E3B; font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 2rem; }
          .form-group { margin-bottom: 1rem; }
          label { display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500; }
          input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; box-sizing: border-box; }
          input:focus { outline: none; border-color: #10B981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
          button { width: 100%; background: #10B981; color: white; padding: 0.75rem; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; }
          button:hover { background: #059669; }
          .error { color: #dc2626; margin-bottom: 1rem; padding: 0.5rem; background: #fee2e2; border-radius: 4px; }
          .success { color: #065f46; margin-bottom: 1rem; padding: 0.5rem; background: #d1fae5; border-radius: 4px; }
          .back-link { text-align: center; margin-top: 1rem; }
          .back-link a { color: #10B981; text-decoration: none; }
          .inspector-badge { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1rem; color: #059669; }
          .inspector-icon { width: 20px; height: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">UrbanGrid</div>
          <div class="inspector-badge">
            <svg class="inspector-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Inspector Portal
          </div>
          <h2 style="text-align: center; margin-bottom: 2rem; color: #374151;">Login to Inspector Portal</h2>
          ${error ? '<div class="error">Invalid username or password</div>' : ''}
          <div id="success-message" class="success" style="display: none;">Login successful! Redirecting to Inspector App...</div>
          <form id="inspector-login-form" method="POST">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Login to Inspector Portal</button>
          </form>
          <div class="back-link">
            <a href="/">← Back to Website</a>
          </div>
        </div>

        <script>
          document.getElementById('inspector-login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const username = formData.get('username');
            const password = formData.get('password');
            
            try {
              const response = await fetch('/api/inspector/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
              });
              
              if (response.ok) {
                const data = await response.json();
                document.getElementById('success-message').style.display = 'block';
                document.getElementById('inspector-login-form').style.display = 'none';
                
                // Redirect to external inspector app after 2 seconds
                setTimeout(() => {
                  window.location.href = data.redirectUrl;
                }, 2000);
              } else {
                // Show error and reload page to display error message
                window.location.href = '/inspector/login?error=1';
              }
            } catch (error) {
              console.error('Login error:', error);
              window.location.href = '/inspector/login?error=1';
            }
          });
        </script>
      </body>
      </html>
    `);
  });

  // Update auth user endpoint to handle both admin and inspector sessions
  app.get('/api/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      if (user.type === 'inspector') {
        res.json({
          id: user.claims.sub,
          email: user.claims.email,
          username: user.claims.username,
          fullName: user.claims.full_name,
          role: 'inspector',
          type: 'inspector'
        });
      } else {
        // Existing admin user handling
        res.json({
          id: user.claims.sub,
          email: user.claims.email,
          firstName: user.claims.first_name,
          lastName: user.claims.last_name,
          role: user.claims.role || 'admin',
          type: 'admin'
        });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
}