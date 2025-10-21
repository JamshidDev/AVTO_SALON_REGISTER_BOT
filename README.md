# AVTO SALON BOT

Telegram bot for auto salon management built with GrammyJS, featuring conversations, i18n support, and polling.

## Features

- 🚗 Car catalog browsing
- 💬 Interactive conversations
- 🌐 Multi-language support (Uzbek & English)
- 📞 Contact information
- ℹ️ About salon information
- 🔄 Polling-based updates

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Telegram Bot Token (from @BotFather)

## Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and add your bot token:
   ```
   BOT_TOKEN=your_bot_token_here
   BOT_USERNAME=your_bot_username
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The bot will start on port 9000 (configurable in .env file).

## Project Structure

```
AVTO_SALON_BOT/
├── bot.js                 # Main bot file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── .env.example          # Environment variables template
├── config/
│   ├── config.js         # Configuration settings
│   └── i18n.js           # Internationalization setup
├── conversations/
│   └── main.js           # Conversation handlers
├── locales/
│   ├── uz/
│   │   └── translation.json  # Uzbek translations
│   └── en/
│       └── translation.json  # English translations
└── utils/
    └── context.js        # Context utilities
```

## Bot Commands

- `/start` - Start the bot and show main menu
- `/menu` - Show main menu

## Bot Features

### Main Menu
- 🚗 Car Catalog - Browse available cars
- 📞 Contact Us - Get contact information
- ℹ️ About Us - Learn about the salon
- 🌐 Language Selection - Change language

### Car Catalog
- Browse cars by brand (Toyota, Honda, BMW, Mercedes, Audi, Hyundai, Chevrolet, Nissan)
- View car details (price, year, mileage, fuel type, transmission)
- Contact options for inquiries

### Languages
- 🇺🇿 Uzbek (default)
- 🇺🇸 English

## Configuration

Edit `config/config.js` to modify:
- Bot settings
- Server configuration
- Database settings (for future use)
- Logging levels

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BOT_TOKEN` | Telegram bot token from @BotFather | Yes |
| `BOT_USERNAME` | Bot username | Yes |
| `PORT` | Server port (default: 9000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `LOG_LEVEL` | Logging level | No |

## Development

### Adding New Languages

1. Create new directory in `locales/` (e.g., `locales/ru/`)
2. Add `translation.json` file with translations
3. Update `config/i18n.js` to include new language
4. Add language selection button in conversations

### Adding New Conversations

1. Create conversation function in `conversations/main.js`
2. Register conversation in `bot.js`
3. Add callback handlers for conversation triggers

### Adding New Car Brands

1. Update `locales/*/translation.json` with new brand names
2. Add brand to car details object in `conversations/main.js`
3. Add brand button to car selection keyboard

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check if BOT_TOKEN is correct
2. **Language not changing**: Verify i18n configuration
3. **Conversations not working**: Check conversation plugin installation

### Logs

The bot logs important events to console. Set `LOG_LEVEL` in .env for different verbosity levels.

## License

MIT License

## Support

For support, contact the development team or create an issue in the project repository.
