import { Bot} from "grammy";
import config from "./config/config.js";
import { configComposer, clientComposer } from "./composer/index.js";
import { connectDB } from "./config/database.js";


// Validate configuration
config.validate();

// Create bot instance
var bot = new Bot(config.botToken);

bot.use(configComposer)
bot.use(clientComposer)




























// Error handling
bot.catch(function(err) {
  console.error('Bot error:', err);
});

// Start the bot
function startBot() {
  return Promise.resolve().then(function() {
    console.log('Starting AVTO SALON Bot...');
    console.log('Bot running on port ' + config.port);
    
    // Connect to database first
    return connectDB();
  }).then(function() {
    console.log('Database connected successfully!');
    
    // Start polling
    return bot.start({
      dropPendingUpdates: config.botSettings.dropPendingUpdates,
    });
  }).then(function() {
    console.log('Bot started successfully!');
  }).catch(function(error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  });
}

// Handle graceful shutdown
process.on('SIGINT', function() {
  console.log('Shutting down bot...');
  return bot.stop().then(function() {
    process.exit(0);
  });
});

process.on('SIGTERM', function() {
  console.log('Shutting down bot...');
  return bot.stop().then(function() {
    process.exit(0);
  });
});

// Start the bot
startBot();
