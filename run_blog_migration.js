
import { readFileSync } from 'fs';
import { pool } from './server/db.js';

async function runBlogMigration() {
  try {
    const sql = readFileSync('add_fresh_blogs_2025.sql', 'utf8');
    
    // Split by semicolons and filter out empty statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await pool.query(statement);
      }
    }
    
    console.log('✅ Blog migration completed successfully!');
    console.log('Added 10 fresh blog posts with comprehensive internal linking.');
    
    // Verify the insertion
    const result = await pool.query('SELECT COUNT(*) as count FROM blog_posts WHERE DATE(created_at) = CURRENT_DATE');
    console.log(`📊 Total blog posts added today: ${result.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running blog migration:', error);
    process.exit(1);
  }
}

runBlogMigration();
