const TOKEN = 'NzIxMDM5NzI0MTQ3NTA3MzEw.XuOukg.GV9O7B9qe1wdhnzATUrM4gYmqUU'

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId,guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('ladder').setDescription('顯示天梯資訊!'),
	new SlashCommandBuilder().setName('ladder-hc').setDescription('顯示專家天梯資訊!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId,guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);