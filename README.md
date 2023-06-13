# The Seer - Discord Bot

<div align="center">
<a href="https://discord.gg/Q3ZhdRJ">
<img src="https://img.shields.io/discord/495602800802398212.svg?colorB=Blue&logo=discord&label=Support&style=for-the-badge" alt="Support">
</a>
<a href="https://github.com/Valhalla-Development/TheSeer">
<img src="https://img.shields.io/github/languages/top/Valhalla-Development/TheSeer.svg?style=for-the-badge">
</a>
<a href="https://github.com/Valhalla-Development/TheSeer/issues">
<img src="https://img.shields.io/github/issues/Valhalla-Development/TheSeer.svg?style=for-the-badge">
</a>
<a href="https://github.com/Valhalla-Development/TheSeer/pulls">
<img src="https://img.shields.io/github/issues-pr/Valhalla-Development/TheSeer.svg?style=for-the-badge">
</a>
<a href="https://app.codacy.com/gh/Valhalla-Development/TheSeer/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade">
<img src="https://img.shields.io/codacy/grade/49b97351b8604c9a904991e633afc0be?style=for-the-badge">
<br>
</div>

The Seer is a bot designed to monitor other bots status, this can be useful if you are a developer and wish to monitor
your bots while you work on them. You can opt to receive alerts via DM, or a channel of your choosing.

You will be alerted if a bot of your choosing either goes offline, or online.

You can either host this bot yourself, or you can invite it to your server
by [clicking here](https://discord.com/oauth2/authorize?client_id=559113940919910406&scope=bot&permissions=414464724032).

## Usage (Invite):

- Invite the bot
  by [clicking me](https://discord.com/oauth2/authorize?client_id=559113940919910406&scope=bot&permissions=414464724032)
- Once the bot is in your guild, all you need to do to set it up is run the following commands:
  Note: Two of these commands are optional, however you must enable at least one to receive alerts.

```text
/add <@bot> // tag a bot of your choosing, there is no limit to how many bots you can watch
/channel <#channel> // (optional) tag a channel you wish the alerts to be sent to
/clear // removes all data from database containing any information matching your guild id
/dm // (optional) if enabled, you will receive DM alerts for the bot
/remove <@bot> // tag a bot of your choosing to remove from the watch list
```

## Usage (Self Host)

I am going to assume you have the basics installed on your host/computer (i.e. node, npm etc.)

- Download the source, by clicking 'Releases -> Latest version -> Source code (zip)',
  or [click me](https://github.com/Valhalla-Development/TheSeer/releases)
- Extract the zip with software of your choosing
- Inside you will find a file named '.env.example', you must add the specified values. After you have edited the file,
  edit the file name to '.env', alternatively you can copy the example file and rename it. If you are unsure where to
  find your bot token & owner id, please refer to these
  links: [bot token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) | [owner id](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
- Open a console window in the root directory of the bot, then run the following command:

```text
$ yarn install // installs required modules, once completed run the next command:
$ yarn build // builds the source
$ yarn start // this will start your bot, you are now ready to use your bot!
```
