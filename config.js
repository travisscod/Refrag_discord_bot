require('dotenv').config();

module.exports = {
    discord: {
        token: process.env.DISCORD_TOKEN,
        clientId: process.env.DISCORD_CLIENT_ID,
        guildId: process.env.DISCORD_GUILD_ID
    },
    refrag: {
        email: process.env.REFRAG_EMAIL,
        password: process.env.REFRAG_PASSWORD,
    }
};