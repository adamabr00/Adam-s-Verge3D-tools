const fs = require('fs');
const path = require('path');

// 🔹 Paths
const baseDir = __dirname;
const dbPath = path.join(baseDir, 'blockDatabase.json');
const plugPath = path.join(baseDir, 'init.plug');
const backupPath = path.join(baseDir, 'init.plug.bak');

// 🔹 Read database JSON
if (!fs.existsSync(dbPath)) {
  console.error('❌ blockDatabase.json not found!');
  process.exit(1);
}
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const dbJS = `window.BLOCK_DATABASE = ${JSON.stringify(db, null, 2)};`;

// 🔹 Read init.plug
if (!fs.existsSync(plugPath)) {
  console.error('❌ init.plug not found!');
  process.exit(1);
}
let plug = fs.readFileSync(plugPath, 'utf8');

// 🔹 Backup original init.plug
if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(plugPath, backupPath);
  console.log('✅ Backup created: init.plug.bak');
} else {
  console.log('ℹ️ Backup already exists, skipping creation.');
}

// 🔹 Replace placeholder
if (!plug.includes('/*__BLOCK_DB__*/')) {
  console.error('❌ Placeholder /*__BLOCK_DB__*/ not found in init.plug!');
  process.exit(1);
}
plug = plug.replace('/*__BLOCK_DB__*/', dbJS);

// 🔹 Overwrite init.plug
fs.writeFileSync(plugPath, plug);
console.log('✅ Successfully injected database and updated init.plug');
