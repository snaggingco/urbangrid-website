
import bcrypt from 'bcryptjs';
import { db } from './server/db.js';
import { inspectors } from './shared/schema.js';
import { eq, sql } from 'drizzle-orm';

async function fixInspectorPasswords() {
  try {
    // Get all inspectors with potentially unhashed passwords (less than 50 characters)
    const inspectorsWithUnhashedPasswords = await db
      .select()
      .from(inspectors)
      .where(sql`LENGTH(password_hash) < 50`);

    console.log(`Found ${inspectorsWithUnhashedPasswords.length} inspectors with potentially unhashed passwords`);

    for (const inspector of inspectorsWithUnhashedPasswords) {
      console.log(`Processing inspector: ${inspector.username}`);
      
      // You need to manually specify the plain text password for each inspector
      // For the default inspector "shahbas", we know the password
      let plainPassword;
      
      if (inspector.username === 'shahbas') {
        plainPassword = 'Shahbas@123#';
      } else {
        console.log(`Please manually set the password for inspector: ${inspector.username}`);
        continue; // Skip this inspector for now
      }

      // Hash the password
      const hashedPassword = bcrypt.hashSync(plainPassword, 10);
      
      // Update the database
      await db
        .update(inspectors)
        .set({ passwordHash: hashedPassword, updatedAt: new Date() })
        .where(eq(inspectors.id, inspector.id));
        
      console.log(`Updated password for inspector: ${inspector.username}`);
    }

    console.log('Password fixing complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing passwords:', error);
    process.exit(1);
  }
}

fixInspectorPasswords();
