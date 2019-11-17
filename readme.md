# devmod
> v5.1.0

> A bot for moderating discord servers. Written by and for developers with modularity in mind.

This was originally made to moderate the Devcord community on Discord, but you don't need to be a developer to use it.

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
on your host machine.

If you are familiar with git, clone the devmod repo using `git clone`.
Otherwise, download the repo as a zip and unpack it to any folder of
your choosing. Open up the command line and `cd` into the folder that contains
the cloned/unzipped code.

Run `yarn` (or `npm install`) to install all of the bot's dependencies and then `yarn global add pm2`
(or `npm install -g pm2`) to be able to run the bot in the background. The host machine
is now configured to run the bot. All you need to do now is set up the config.

Of course, you could also run the bot with other solutions, such as `forever`, `tmux`, or `screen`.

### Step 4 - Configuring the bot
To configure the bot, edit `devmod.config.js`. The supported values are in the table below.

Option | Default | Description
---|---|---
`botToken` | `undefined` | Discord API token for the bot.
`prefix` | `.` | Prefix for bot commands.
`msgDeleteTime` | `join(__dirname, '..', '..', 'devmod.db')` | Amount of time in seconds to wait before deleting large help messages.
`dbFile` | `devmod.db` | Absolute path for the database file.
`autoBan` | `true` | Whether or not to enforce auto-banning after a specified number of warnings.
`autoBanWarns` | `3` | Amount of warnings to warrant an auto-ban if enabled.
`banMsgDelete` | `0` | Number of days of messages to delete when user is banned.
`thanks` | `['thank', 'kudos']` | List of triggers for thanking users.
`channels.warn` | `'warnings'` | Channel to forward all warning confirmation messages.
`channels.bans` | `'bans'` | Channel to forward all ban confirmation messages.
`channels.reports` | `'reports'` | Channel to forward all user report messages.
`channels.roles` | `'roles'` | Channel to send and listen to reactions for roles.
`channels.info` | `'info'` | Channel to send the info to.
`channels.crusade` | `'crusade'` | Channel to send notifications that the anti bot crusade has deleted a message.
`channels.errors` | `'errors'` | Channel to log errors to.
`roles.muted` | `'muted'` | Name of the role to apply to muted users.
`roles.verified` | `'verified'` | Name of the role to apply to verified users.
`Activities` | `[...]` | List of activities for the bot's status message.
`tags` | `[...]` | List of tags for the `.tag` command. Each one is a discord embed object. Can be imported from a different file (config/tags.js).
`approvedRoles` | `[...]` | List of lists of roles the reaction roles channel. Can be imported from a different file (config/approvedRoles.js).

### Step 5 - Running the Bot
Now that you have all of the options set up, you can run the bot. To run it normally, use
`yarn start` (`npm run start`). It can also be run with `node ./src/esm.js`.

#### Verification bot
There is also a verification bot that requires users to click a reaction on a message to agree to
some rules in order to get a role added which you can configure to give them permission participate.

You can start this bot with `yarn verify` (or `npm run verify`) or with `node ./src/utils/verify.js`.

Now the bot is ready for use!

> Just a quick note - the default tags in `config/tags.js`, the activities in
`src/utils/default.config.js/activities.js`, and the roles in `config/approvedRoles.js`
may not be specific to all servers, so make sure to check those out
before running the bot.

## Usage
The usage of this bot is described and documented on the [usage page](docs/usage.md).

## Future Ideas
- Add configuration for whether to delete warns on a ban.
- Add usage statistics to DB.

## Author
**devmod** © [RedXTech](https://github.com/redxtech), Released under the [MIT](./LICENSE.md) License.
