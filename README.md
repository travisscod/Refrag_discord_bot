# CS2 Refrag Discord Bot

A Discord bot that starts CS2 retake servers using Refrag.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your Discord bot token and Refrag.gg credentials

4. Start the bot:
   ```bash
   npm start
   ```

## Commands

- `/retake` - Starts a new CS2 retake server on de_mirage

## Project Structure

- `bot.js` - Main Discord bot file
- `refrag-api.js` - Refrag.gg API wrapper class
- `config.js` - Configuration management
- `package.json` - Node.js dependencies and scripts
- `.env.example` - Environment variables template

## Usage

After inviting the bot to your Discord server, use the `/retake` command to start a new CS2 retake server. The bot will respond with connection details once the server is ready.