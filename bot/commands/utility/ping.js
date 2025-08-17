const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong! and the API latency.')
        // This will disable the command for anyone who doesn't have the "Manage Messages" permission by default
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	// Add a permissions property for our server-side check
	permissions: [PermissionFlagsBits.ManageMessages],
	cooldown: 5, // seconds, optional
	async execute(interaction) {
		await interaction.reply({ content: 'Pinging...' });
		const sent = await interaction.fetchReply();
		const apiLatency = Math.round(interaction.client.ws.ping);
		const latency = sent.createdTimestamp - interaction.createdTimestamp;
		await interaction.editReply(`Pong! Roundtrip latency: ${latency}ms. API Latency: ${apiLatency}ms`);
	},
};
