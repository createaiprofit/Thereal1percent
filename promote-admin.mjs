import { createConnection } from 'mysql2/promise';
import { config } from 'dotenv';
config();

const conn = await createConnection(process.env.DATABASE_URL);

// Check all users
const [users] = await conn.execute('SELECT id, openId, name, email, role FROM users');
console.log('Current users:', JSON.stringify(users, null, 2));

const ownerOpenId = process.env.OWNER_OPEN_ID;
console.log('\nOwner openId:', ownerOpenId);

if (ownerOpenId) {
  // Update owner to admin
  const [result] = await conn.execute(
    'UPDATE users SET role = ? WHERE openId = ?',
    ['admin', ownerOpenId]
  );
  console.log('\nUpdate result:', result);
  
  // Verify
  const [updated] = await conn.execute('SELECT id, openId, name, role FROM users WHERE openId = ?', [ownerOpenId]);
  console.log('\nUpdated user:', JSON.stringify(updated, null, 2));
}

await conn.end();
