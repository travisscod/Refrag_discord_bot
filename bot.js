const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const config = require('./config');
const RefragAPI = require('./refrag-api');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

const refragAPI = new RefragAPI();

async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName('retake')
            .setDescription('Start a CS2 retake server')
            .addStringOption(option =>
                option.setName('map')
                    .setDescription('Select the map for the retake server')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Overpass', value: 'de_overpass' },
                        { name: 'Anubis', value: 'de_anubis' },
                        { name: 'Ancient', value: 'de_ancient' },
                        { name: 'Mirage', value: 'de_mirage' },
                        { name: 'Vertigo', value: 'de_vertigo' },
                        { name: 'Dust 2', value: 'de_dust2' },
                        { name: 'Inferno', value: 'de_inferno' },
                        { name: 'Nuke', value: 'de_nuke' },
                        { name: 'Train', value: 'de_train' }
                    )
            )
    ];

    const rest = new REST({ version: '10' }).setToken(config.discord.token);
    
    try {
        await rest.put(
            Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId),
            { body: commands }
        );
        console.log('Slash command registered successfully.');
    } catch (error) {
        console.error('Failed to register slash commands:', error);
    }
}

client.on('ready', async () => {
    console.log(`Bot is ready as ${client.user.tag}`);
    await registerCommands();
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'retake') {
        return;
    }

    const selectedMap = interaction.options.getString('map');
    await interaction.reply(`Starting your server on ${selectedMap}, please wait...`);

    try {
        const auth = await refragAPI.login();
        await refragAPI.startNewServer(selectedMap, auth);
        
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const updatedAuth = await refragAPI.login();
        const connectionString = await refragAPI.getConnectionString(updatedAuth);
        
        await interaction.editReply(`Server Ready on ${selectedMap}!\n\`${connectionString}\``);
    } catch (error) {
        console.error('Server start error:', error);
        await interaction.editReply('Failed to start server. Please try again later.');
    }
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

client.login(config.discord.token);
