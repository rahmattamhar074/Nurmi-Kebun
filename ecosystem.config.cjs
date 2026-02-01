module.exports = {
  apps: [
    {
      name: 'inertia-ssr',
      script: 'php',
      args: 'artisan inertia:start-ssr',
      cwd: '/www/wwwroot/kizaru-pos',
      interpreter: 'none',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './storage/logs/ssr-error.log',
      out_file: './storage/logs/ssr-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
