// Reset Business Starter PIN: clears the stored pin_hash + all sessions.
// Next page load → app shows the "create PIN" setup screen.
import initSqlJs from 'sql.js';
import fs from 'node:fs';

const dbPath = process.env.DB_PATH || './server/data/app.db';
const SQL = await initSqlJs();
const db = new SQL.Database(fs.readFileSync(dbPath));
db.run("DELETE FROM auth_settings WHERE key = 'pin_hash'");
db.run('DELETE FROM sessions');
fs.writeFileSync(dbPath, Buffer.from(db.export()));
console.log('PIN reset ✓ — reload Business Starter and set a new PIN.');