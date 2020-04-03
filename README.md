# The Seer - Discord Bot

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ba81abdd29a444e29c8dee1655fd269c)](https://app.codacy.com/app/hudsonjd/TheSeer-Discord?utm_source=github.com&utm_medium=referral&utm_content=RagnarLothbrok-Odin/TheSeer-Discord&utm_campaign=Badge_Grade_Dashboard)

The Seer is a bot designed to monitor other bots status, this can be useful if you are a developer and wish to monitor your bots while you work on them. You can opt to receive alerts via DM, or a channel of your choosing.

You will be alerted if a bot of your choosing either goes offline, or online.

You can either host this bot yourself, or you can invite it to your server by [clicking here](https://dillinger.io/).
### Usage (Invite):
  - Invite the bot by [clicking me](https://dillinger.io/)
  - Once the bot is in your guild, all you need to do to set it up is run the following commands:
Note: Two of these commands are optional, however you must enable at least one to receive alerts.
  ```text
  ts;add <@bot> // tag a bot of your choosing, there is no limit to how many bots you can watch
  ts;channel <#channel> // (optional) tag a channel you wish the alerts to be sent to
  ts;dm <on/off> // (optional) if enabled, you will receive alerts for the bot
  ```
    
### Usage (Self Host)
I am going to asume you have the basics installed on your host/computer (i.e. node, npm etc.)

  - Download the source, by clicking 'Clone or download -> Download ZIP', or [click me](https://github.com/RagnarLothbrok-Odin/TheSeer-Discord/archive/master.zip)
  - Extract the zip with software of your choosing
  - Inside you will find a file name 'botconfig-example.json', you must add your token, and ownerid. After you have edited the file, edit the file name to 'botconfig.json', alternatively you can copy the example file and rename it. If you are unsure where to find your bot token & owner id, please refer to these links: [bot token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) | [owner id](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
  - Open a console window in the root directory of the bot, then run the command:
  ```sh
  $ npm install // installs required modules, once completed run the next command:
  $ node . // this will start your bot, you are now ready to use your bot!
   ```