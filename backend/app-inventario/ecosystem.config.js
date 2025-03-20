module.exports = {
  apps: [{
    name: 'app-inventario',
    script: './dist/main.js', 
    instances: 1,
    autorestart: true,
    watch: ['dist'],
    ignore_watch: ['node_modules', 'logs'],
    watch_options: {
      followSymlinks: false,
      usePolling: true,
      interval: 1000
    },
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3002,
      MONGODB_URI: 'mongodb://localhost:27017/sige',
      JWT_SECRET: 'sige_secret_key_2025'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3002,
      MONGODB_URI: 'mongodb://localhost:27017/sige',
      JWT_SECRET: 'sige_secret_key_2025_prod'
    }
  }]
};