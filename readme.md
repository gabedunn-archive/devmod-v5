# devmod
> v5.0.0

> A Discord bot for moderating servers.

This was originally made to moderate the DevCord Discord community, but you
don't need to be a developer to use it.

## Setup

### Step 1 - Creating the Bot User

First, go to the
[Discord Developers](https://discordapp.com/developers/applications/me)
page and create a new app. Name the app and give it a profile picture as you
please. Afterwards, navigate to the "Bot" section. Click on "Add Bot" under the
"Build-a-Bot" subsection. A popup will appear asking you to confirm the action.
Once you confirm the action, the bot section will expand and you will be able to
obtain your token under the "Token" section. This token will allow your bot to
log in to Discord.

### Step 2 - Inviting the Bot to your Server

Navigate to the "OAuth2" section and head to the "OAuth2 URL Generator"
subsection. Under the "Scopes" section, click on "bot". A new section, titled
"Bot Permissions", will appear. Select "Administrator. This will allow the bot
to see all of the channels, ban users, etc. Afterwards, look at the "Scopes"
section. At the bottom, there is a URL contained within a field. Copy and paste
the URL into a new browser tab. A list of servers in which you have
administrator permissions will appear. After choosing a server and clicking
"Authorize", the bot will join the selected server.

### Step 3 - Setting Up the Host Machine

Because the bot runs on [node](https://nodejs.org), you must have it installed
on your host machine. If you are familiar with git, clone the devmod repo using
`git clone`. Otherwise, download the repo as a zip and unpack it to any folder of
your choosing. Open up the command line and `cd` into the folder that contains
the cloned/unzipped code.

Run `npm install` (or `yarn`) to install all of the bot's dependencies and then `npm install
-g pm2` (or `yarn global add pm2`) to be able to run the bot in the background. The host machine is now
configured to run the bot. All you need to do now is set up the config.

### Step 4 - Configuring the bot

This part is easy. Just type in `npm run env` and it will ask you some
questions.

Option | Default | Description
---|---|---
`BOT_TOKEN` | | The token you got from creating the bot user.
`BOT_OWNER` | | Your [Discord ID](https://goo.gl/fTsqkq).
`PREFIX` | `.` | The prefix to trigger bot commands.
`MSG_DELETE_TIME` | `20` | The amount of seconds before deleting the help commands.
`DB_FILE` | `devmod.db` | The name of the database file for settings, warnings, and reputation.
`AUTOBAN` | `true` | Whether or not to automatically ban a user after hitting the maximum amount of warnings.
`AUTOBAN_WARNS` | `3` | The number warnings are needed to autoban a user.
`BAN_MSG_DELETE` | `0` | The number of days of a user's messages to delete after being banned.
`CHANNEL_WARN` | `warnings` | The name of the channel to log warnings.
`CHANNEL_BAN` | `bans` | The name of the channel to log bans.
`CHANNEL_REPORT` | `reports` | The name of the channel to log reports.
`CHANNEL_ROLES` | `roles` | The name of the channel to send and listen to reactions for roles.
`CHANNEL_INFO` | `info` | The name of the channel to send the info message.
`CHANNEL_CRUSADE` | `crusade` | The name of the channel to send notifications that the anti bot crusade has deleted a message.
`ROLE_MUTED` | `muted` | The name of the role to apply to muted users.
`ROLE_VERIFIED` | `verified` | The name of the role to apply to verified users.

Afterwards, open up `src/utils/approvedRoles.js`. Add role names and emojis 
that you would like members to be able to assign to themselves via the
role command and reactions. This is case sensitive, so be sure to get 
it 100% accurate.

### Step 5 - Running the Bot

Now that you have all of the options set up, you can run the bot. If you want to
run it on your computer while keeping the command line window open, use either the
command `npm run start` (`yarn start`) or `npm run build` (`yarn build`)
and `node ./dist/devmod.js`.

If you want to run the bot in the background without needing to keep a command
line window open, build it with `npm run build` (`yarn build`) and run 
it with the command `pm2 start ./dist/devmod.js`.

Now the bot is ready for use!

> Just a quick note - the tags in `src/utils/tags.js`, the activities in
`src/utils/activities.js`, and the roles in `src/utils/approvedRoles.js`
may not be specific to all servers, so make sure to check those out
before running the bot.

## Features & Usage

> This overview assumes that all config options are set to their defaults.

### Warning Users

If a user has a role that allows them to kick users, they can use the
warns system.

`.warn <user> <reason>` will send a DM to the user with their warning, send a
message to the channel specified in `CHANNEL_WARN`, and adds the warning to
the database file along with the ID of the user who issued it. If a user already
has 2 warnings, they will be banned. A DM will be sent to them with the reason
and it will be logged to the bans channel. Once they are banned, all of their
warnings are removed from the database.

`.warns <user>` will list all of the warnings a user
has, the reasons for these warnings, and the people who warned them.

`.clearwarns <user>` (or `.cwarns <user>`) will clear the warnings from
a user.

### Banning Users

If a user has a role that allows them to ban users, they can use the ban
command.

`.ban <user> [<days> <reason>]` will ban a user for the specified reason
and remove the user's messages from the specified amount of days previous.

### Unbanning Users

If a user has a role that allows them to ban user, they are able to use
the unban command.

`.unban <user> [<reason>]` will unban a user from their username.

### Reporting Users

Any user can use the report command.

`.report <message>` will send a message into the reports channel with the
message, the name of the user who sent it, and the channel that it was sent
from.

### Tags

Any user is able to use tags and list tags.

`.tag <tag> [<user>]` will call up a tag. If `<user>` is specified, the bot will
tag the user when sending the message.

`.tags` will show a list of tags. This list will be deleted after 10 seconds.

> Tags commands can be used in DMs.

### Reputation

Saying `thanks @user` or `kudos @user` will add 1 reputation to the user
mentioned.

You can view a user's reputation by running `.reputation <user>`.

### Roles System

Anyone can use the role command. It will add & remove roles that have been
whitelisted in `src/utils/approvedRoles.js`.

`.role add <role>` will add the specified role.

`role rm <role>` will remove the specified role.

Both commands are case sensitive.

The roles will also be available to be added in the specified roles
channel after running the `.buildroles` command.

### Prune

Anyone with MANAGE_MESSAGES permission can use this command.

`.prune [<amount>]` will remove the specified amount of commands from the
current channel. If no number is specified, the default is 5.

### Stats & Users Commands

These commands can be used by all users on the server.

`.stats` will display stats about the user.

`.users` will display the number of users on the server.

### LMGTFY

This command can be used by anyone.

`.lmgtfy <query>` will send a link with the LMGTFY query.

### Help

Anyone can use this command.

`.help` will send a message with a list of commands and how to use them. The
message will be deleted after 20 seconds.

### Ping

Anyone can use this command.

`.ping` will send a message to the chat with the ping and round trip time of the
bot.

## Future Ideas

- Add configuration for whether to delete warns on a ban.
- Add usage statistics to DB.
