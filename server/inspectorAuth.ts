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