module.exports = {
  apps: [
    {
      name: 'hargabandingin-scraper',
      script: './src/index.js',
      cwd: '/home/agushidayatullah21th/scraper',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
      },
      // Log files
      out_file: './logs/scraper-out.log',
      error_file: './logs/scraper-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
