const fs = require('fs');
const os = require('os');
const path = require('path');

const root = process.cwd();
const envPath = path.join(root, '.env');
const examplePath = path.join(root, '.env.example');

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

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

function loadBaseEnv() {
  if (fs.existsSync(envPath)) {
    return fs.readFileSync(envPath, 'utf8');
  }

  if (fs.existsSync(examplePath)) {
    return fs.readFileSync(examplePath, 'utf8');
  }

  return '';
}

function upsertVar(lines, key, value) {
  let updated = false;
  const nextLines = lines.map((line) => {
    if (line.trim().startsWith(`${key}=`)) {
      updated = true;
      return `${key}="${value}"`;
    }

    return line;
  });

  if (!updated) {
    nextLines.push(`${key}="${value}"`);
  }

  return nextLines;
}

try {
  const base = loadBaseEnv();
  const lines = base ? base.split(/\r?\n/) : [];

  let updatedLines = upsertVar(lines, 'DATABASE_URL', databasePaths[mode]);

  for (const [key, value] of Object.entries(DEFAULTS)) {
    const exists = updatedLines.some((line) => line.trim().startsWith(`${key}=`));

    if (!exists) {
      updatedLines.push(`${key}="${value}"`);
    }
  }

  while (updatedLines.length && updatedLines[updatedLines.length - 1].trim() === '') {
    updatedLines.pop();
  }

  fs.writeFileSync(envPath, `${updatedLines.join('\n')}\n`);
  log(`Generated .env for ${mode} (DATABASE_URL=${databasePaths[mode]})`);
} catch (err) {
  console.error('Error generating .env:', err.message);
  process.exit(1);
}
