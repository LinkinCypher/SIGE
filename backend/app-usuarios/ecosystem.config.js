module.exports = {
    apps: [{
      name: 'app-usuarios',
      script: './dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
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