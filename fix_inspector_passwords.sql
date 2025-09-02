
-- Fix unhashed passwords in inspectors table
-- This script will hash any plain text passwords using PostgreSQL's crypt function with bcrypt

-- First, let's see what passwords need to be fixed (optional check)
-- SELECT id, username, password_hash, LENGTH(password_hash) as hash_length 
-- FROM inspectors 
-- WHERE LENGTH(password_hash) < 50; -- bcrypt hashes are typically 60 characters

-- Update any unhashed passwords (assuming they are shorter than typical bcrypt hashes)
-- Note: You'll need to manually run this with the actual plain text passwords

-- Example for the default inspector "shahbas" if it was added without hashing:
-- UPDATE inspectors 
-- SET password_hash = crypt('Shahbas@123#', gen_salt('bf', 10))
-- WHERE username = 'shahbas' AND LENGTH(password_hash) < 50;

-- If you know other specific passwords that need to be hashed, add them here:
-- UPDATE inspectors 
-- SET password_hash = crypt('actual_plain_password', gen_salt('bf', 10))
-- WHERE username = 'specific_username' AND LENGTH(password_hash) < 50;

-- Verify the fix (optional check)
-- SELECT id, username, password_hash, LENGTH(password_hash) as hash_length 
-- FROM inspectors;
