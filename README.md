# The Seer - Discord Bot

## Project has gone stale due to my focus on my other Discord bot, planning on updating some if The Seer code when I have finished with my current goal on my other bot.


<div align="center">
<a href="https://discord.gg/Q3ZhdRJ">
<img src="https://img.shields.io/discord/495602800802398212.svg?colorB=Blue&logo=discord&label=Support&style=for-the-badge" alt="Support">
</a>
<a href="https://github.com/RagnarLothbrok-Odin/TheSeer-Discord">
<img src="https://img.shields.io/github/languages/top/RagnarLothbrok-Odin/TheSeer-Discord.svg?style=for-the-badge">
</a>
<a href="https://github.com/RagnarLothbrok-Odin/TheSeer-Discord/issues">
<img src="https://img.shields.io/github/issues/RagnarLothbrok-Odin/TheSeer-Discord.svg?style=for-the-badge">
</a>
<a href="https://github.com/RagnarLothbrok-Odin/TheSeer-Discord/pulls">
<img src="https://img.shields.io/github/issues-pr/RagnarLothbrok-Odin/TheSeer-Discord.svg?style=for-the-badge">
</a>
<br>
</div>

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/539c2d29d8e34346bbec2f95ceb3a20b)](https://app.codacy.com/manual/hudsonjd/TheSeer-Discord?utm_source=github.com&utm_medium=referral&utm_content=RagnarLothbrok-Odin/TheSeer-Discord&utm_campaign=Badge_Grade_Settings)

The Seer is a bot designed to monitor other bots status, this can be useful if you are a developer and wish to monitor your bots while you work on them. You can opt to receive alerts via DM, or a channel of your choosing.

You will be alerted if a bot of your choosing either goes offline, or online.

You can either host this bot yourself, or you can invite it to your server by [clicking here](https://discordapp.com/oauth2/authorize?client_id=559113940919910406&scope=bot&permissions=387264 ).
## Usage (Invite):
  - Invite the bot by [clicking me](https://dillinger.io/)
  - Once the bot is in your guild, all you need to do to set it up is run the following commands:
Note: Two of these commands are optional, however you must enable at least one to receive alerts.
  ```text
  ts;add <@bot> // tag a bot of your choosing, there is no limit to how many bots you can watch
  ts;channel <#channel> // (optional) tag a channel you wish the alerts to be sent to
  ts;dm <on/off> // (optional) if enabled, you will receive DM alerts for the bot
  ```
    
## Usage (Self Host)
I am going to asume you have the basics installed on your host/computer (i.e. node, npm etc.)

  - Download the source, by clicking 'Clone or download -> Download ZIP', or [click me](https://github.com/RagnarLothbrok-Odin/TheSeer-Discord/archive/master.zip)
  - Extract the zip with software of your choosing
  - Inside you will find a file named 'botconfig-example.json', you must add your token, and ownerid. After you have edited the file, edit the file name to 'botconfig.json', alternatively you can copy the example file and rename it. If you are unsure where to find your bot token & owner id, please refer to these links: [bot token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) | [owner id](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
  - Open a console window in the root directory of the bot, then run the following command:
  ```text
  $ yarn install // installs required modules, once completed run the next command:
  $ node . // this will start your bot, you are now ready to use your bot!
   ```