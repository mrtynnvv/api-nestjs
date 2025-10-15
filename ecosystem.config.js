module.exports = {
  apps: [
    {
      name: 'api-nestjs',
      cwd: __dirname,
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'development',
        DATABASE_URL: 'file:../../external-db/app.sqlite',
      },
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL: 'file:../../external-db/app.sqlite',
      },
    },
  ],
};
