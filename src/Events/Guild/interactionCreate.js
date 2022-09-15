import { EmbedBuilder, InteractionType, codeBlock } from 'discord.js';
import moment from 'moment';
import Event from '../../Structures/Event.js';

export const EventF = class extends Event {
  async run(interaction) {
    if (interaction.isChatInputCommand()) {
      if (!interaction.guild) return;
      const command = this.client.commands.get(interaction.commandName.toLowerCase());
      if (!command) return;

      try {
        const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPerms;
        if (botPermCheck) {
          const missing = interaction.channel.permissionsFor(this.client.user).missing(botPermCheck);
          if (missing.length) {
            if (missing.includes('SendMessages') || missing.includes('EmbedLinks') || missing.includes('ViewChannel')) {
              const errorMsg = `'[PERMISSIONS ERROR]' An attempt to run Command: '${interaction.toString()}' in guild '${
                interaction.guild.name
              }' was made, but I am missing '${missing.join(', ')}' permission.`;
              console.error(
                `[\x1b[31mPERMISSIONS ERROR\x1b[0m] An attempt to run Command: '\x1b[92m${interaction.toString()}\x1b[0m' in guild \x1b[31m${
                  interaction.guild.name
                }\x1b[0m was made, but I am missing '\x1b[92m${missing.join(', ')}s\x1b[0m' permission.`
              );
              const channel = this.client.channels.cache.get('685973401772621843');
              if (!channel) return;
              channel.send(`\`\`\`js\n${errorMsg}\`\`\``);
              return;
            }
            const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
              name: `**${this.client.user.username} - ${this.client.utils.capitalise(command.name)}**`,
              value: `**◎ Error:** I am missing \`${missing.join(', ')}\` permissions, they are required for this command.`
            });
            interaction.reply({ embeds: [embed] }).then((m) => this.client.utils.deletableCheck(m, 10000));
            return;
          }
        }

        const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
        const missing = interaction.channel.permissionsFor(interaction.member).missing(userPermCheck);
        if (missing.length) {
          const embed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor)).addFields({
            name: `**${this.client.user.username} - ${this.client.utils.capitalise(command.name)}**`,
            value: `**◎ Error:** You are missing \`${missing.join(', ')}\` permissions, they are required for this command.`
          });
          interaction.reply({ ephemeral: true, embeds: [embed] }).then((m) => this.client.utils.deletableCheck(m, 10000));
          return;
        }

        await command.run(interaction);
      } catch (error) {
        console.log(error);
      }

      if (this.client.logging === true) {
        const nowInMs = Date.now();
        const nowInSecond = Math.round(nowInMs / 1000);

        const logembed = new EmbedBuilder().setColor(this.client.utils.color(interaction.guild.members.me.displayHexColor));

        logembed.addFields({
          name: `Guild: ${interaction.guild.name} | Date: <t:${nowInSecond}>`,
          value: codeBlock('kotlin', `'${interaction.toString()}' Command was executed by ${interaction.user.tag}`)
        });
        const LoggingNoArgs = `[\x1b[31m${moment().format(
          'LLLL'
        )}\x1b[0m] '\x1b[92m${interaction.toString()}\x1b[0m' Command was executed by \x1b[31m${interaction.user.tag}\x1b[0m (Guild: \x1b[31m${
          interaction.guild.name
        }\x1b[0m)`;
        this.client.channels.cache.get('694680953133596682').send({ embeds: [logembed] });
        console.log(LoggingNoArgs);
      }
    }

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const command = this.client.commands.get(interaction.commandName.toLowerCase());
      if (!command) return;

      try {
        command.autoComplete(interaction);
      } catch (err) {
        console.error(err);
      }
    }
  }
};

export default EventF;
