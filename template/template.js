const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("template")
    .setDescription("A short description of the command")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Optional input")
        .setRequired(false)
    ),

  // Optional metadata your loader can read
  permissions: [PermissionFlagsBits.ManageMessages], // optional
  cooldown: 5, // seconds, optional

  // Optional autocomplete handler
  async autocomplete(interaction) {
    const focused = interaction.options.getFocused();
    const choices = ["apple", "banana", "cherry"];
    const filtered = choices.filter((c) => c.startsWith(focused)).slice(0, 25);
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  // Required: the runtime handler
  async execute(interaction) {
    const input = interaction.options.getString("input") ?? "world";
    await interaction.reply({
      content: `Hello, ${input}!`,
      flags: [MessageFlags.Ephemeral],
    });
  },
};
