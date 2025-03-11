module.exports = {
  apps: [{
    name: 'app-usuarios',
    script: './dist/main.js',
    instances: 1,
    autorestart: true,
    watch: ['dist'], // Vigila solo la carpeta dist
    ignore_watch: ['node_modules', 'logs'],
    watch_options: {
      followSymlinks: false,
      usePolling: true, // Importante para sistemas Windows
      interval: 1000    // Verifica cambios cada segundo
    },
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      MONGODB_URI: 'mongodb://localhost:27017/sige',
      JWT_SECRET: 'sige_secret_key_2025'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      MONGODB_URI: 'mongodb://localhost:27017/sige',
      JWT_SECRET: 'sige_secret_key_2025_prod'
    }
  }]
};