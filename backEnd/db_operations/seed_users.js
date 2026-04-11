
import pg from 'pg';
const { Pool } = pg;
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_HOST === "localhost" ? false : { rejectUnauthorized: false },
});

async function seedUsers() {
  const client = await pool.connect();
  try {
    console.log("--- STARTING USER SEEDING ---");

    // 1. Ensure Roles exist
    console.log("Ensuring roles exist...");
    await client.query(`
      INSERT INTO roles (role_name) 
      VALUES ('Admin'), ('Member')
      ON CONFLICT DO NOTHING
    `);

    // Get role IDs
    const rolesRes = await client.query("SELECT role_id, role_name FROM roles");
    const adminRole = rolesRes.rows.find(r => r.role_name === 'Admin');
    const memberRole = rolesRes.rows.find(r => r.role_name === 'Member');

    if (!adminRole || !memberRole) {
       // If ON CONFLICT DO NOTHING didn't work as expected or rows already exist but we need their IDs
       console.log("Roles assigned.");
    }

    // 2. Ensure a default Jumuiya exists (Small Christian Community)
    console.log("Ensuring default Jumuiya exists...");
    let jumuiyaId = 'ST_THOMAS_001';
    await client.query(`
      INSERT INTO sub_groups (group_id, name, slug, category)
      VALUES (gen_random_uuid(), 'St. Thomas Aquinas', 'st-thomas', 'scc')
      ON CONFLICT DO NOTHING
    `);
    
    const jumuiyaRes = await client.query("SELECT group_id FROM sub_groups WHERE category = 'scc' LIMIT 1");
    if (jumuiyaRes.rows.length > 0) {
        jumuiyaId = jumuiyaRes.rows[0].group_id;
    }

    // 3. Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = {
      id: 'ADM001',
      first: 'System',
      last: 'Administrator',
      email: 'admin@csa.church',
      password: adminPassword
    };

    console.log(`Creating Admin user: ${adminUser.id}...`);
    await client.query(`
      INSERT INTO members (member_id, first_name, last_name, email, password, jumuiya_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (member_id) DO UPDATE SET 
        password = EXCLUDED.password,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name
    `, [adminUser.id, adminUser.first, adminUser.last, adminUser.email, adminUser.password, jumuiyaId]);

    // Assign Admin Role
    if (adminRole) {
        await client.query(`
          INSERT INTO member_roles (member_id, role_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [adminUser.id, adminRole.role_id]);
    }

    // 4. Create Regular Member User
    const memberPassword = await bcrypt.hash('user123', 10);
    const memberUser = {
      id: 'MEM001',
      first: 'John',
      last: 'Doe',
      email: 'john.doe@example.com',
      password: memberPassword
    };

    console.log(`Creating Regular Member user: ${memberUser.id}...`);
    await client.query(`
      INSERT INTO members (member_id, first_name, last_name, email, password, jumuiya_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (member_id) DO UPDATE SET 
        password = EXCLUDED.password,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name
    `, [memberUser.id, memberUser.first, memberUser.last, memberUser.email, memberUser.password, jumuiyaId]);

    // Assign Member Role
    if (memberRole) {
        await client.query(`
          INSERT INTO member_roles (member_id, role_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [memberUser.id, memberRole.role_id]);
    }

    console.log("--- SEEDING COMPLETED SUCCESSFULLY ---");
    console.log("Credentials:");
    console.log(`Admin - ID: ${adminUser.id}, Password: admin123`);
    console.log(`Member - ID: ${memberUser.id}, Password: user123`);

  } catch (err) {
    console.error("❌ SEEDING FAILED:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seedUsers();
