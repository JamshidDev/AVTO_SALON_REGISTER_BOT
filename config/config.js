import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Bot configuration
  botToken: process.env.BOT_TOKEN,
  botUsername: process.env.BOT_USERNAME,
  
  // Server configuration
  port: process.env.PORT || 9000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Admin IDs  
  adminIds: process.env.ADMIN_IDS?.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) || [],
  
  // Database configuration
  database: {
    mongodb: {
      uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qhbhpn.mongodb.net/`
    }
  },
  
  // Bot settings
  botSettings: {
    polling: true,
    dropPendingUpdates: true,
  },
  
  // Validation
  validate: function() {
    if (!config.botToken) {
      throw new Error('BOT_TOKEN is required in environment variables');
    }
  }
};

export default config;
