const fs = require('fs');
const path = require('path');

const root = process.cwd();
const envPath = path.join(root, '.env');
const examplePath = path.join(root, '.env.example');

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

try {
  const hasEnv = fs.existsSync(envPath);
  const hasExample = fs.existsSync(examplePath);

  if (hasEnv) {
    log('✔ .env already exists. Skipping generation.');
    process.exit(0);
  }

  if (hasExample) {
    fs.copyFileSync(examplePath, envPath);
    log('✔ Generated .env from .env.example');
    process.exit(0);
  }

  log('✖ Neither .env nor .env.example found.');
  log('  Create .env or add .env.example and re-run: npm run genEnv');
  process.exit(1);
} catch (err) {
  console.error('Error generating .env:', err.message);
  process.exit(1);
}
