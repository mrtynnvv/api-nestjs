const fs = require('fs');
const path = require('path');

const root = process.cwd();
const envPath = path.join(root, '.env');
const examplePath = path.join(root, '.env.example');

<<<<<<< HEAD
const envTarget = (process.argv[2] || process.env.GEN_ENV_TARGET || 'prod').toLowerCase();
const mode = envTarget === 'dev' ? 'dev' : 'prod';

const databasePaths = {
  dev: `file:${path.join(os.homedir(), 'external-db', 'app.sqlite').replace(/\\/g, '/')}`,
  prod: `file:${path.join(root, '..', 'external-db', 'app.sqlite').replace(/\\/g, '/')}`,
};

const DEFAULTS = {
  JWT_ACCESS_SECRET: 'change_me',
  JWT_ACCESS_EXPIRES: '2592000',
};

=======
>>>>>>> parent of 9bdeb1f (genEnv upd)
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
