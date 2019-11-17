# Usage
> This overview assumes that all config options are set to their defaults.

## Commands
> You can run commands with `.<command>`. Each one has a page describing it's usage.
- [About](./about.md)
- [Ban](./ban.md)
- [Build Info](./buildinfo.md)
- [Build Roles](./buildroles.md)
- [Clear Warns](./clearwarns.md)
- [Help](./help.md)
- [LMGTFY](./lmgtfy.md)
- [Move](./move.md)
- [Mute](./mute.md)
- [Ping](./ping.md)
- [Prune](./prune.md)
- [Report](./report.md)
- [Reputation](./reputation.md)
- [Role](./role.md)
- [Roles](./roles.md)
- [Stats](./stats.md)
- [Tag](./tag.md)
- [Tags](./tags.md)
- [Unban](./unban.md)
- [Unmute](./unmute.md)
- [Users](./users.md)
- [Warn](./warn.md)
- [Warns](./warns.md)

## Processes
> Each of these processes is run as an `async` function when the bot starts up.

### Activity Changer
Every five minutes, the bot's status is set to a random item from the `activities`
element of the config object. After one minute, it's set back to `.help`.

### Command Listener
Every time a message is sent, if it isn't a dm or sent by a bot and begins with `.`,
the command is checked against the commands object from `src/commands/index.js`, and
if it exists, the user is checked to make sure it has the proper permissions, and if
so, the command is run with the arguments passed in.

### Info Reaction Listener
This listens for reactions to the info message, and if a user reacts with the checkmark,
the verified role is added to them, and removed if they remove the reaction.

### Role Reaction Listener
This listens to reactions to the role messages and if they match up with approved roles,
the role is added to the user, and removed if they remove the reaction.

### Thanks Listener
For every message, if it isn't a dm or sent by a bot, and if it contains the words `['thank', 'kudos']`,
the user who was thanked (tagged) gets a reputation point added to them.

### Toriel's Anti Bot Crusade
Adapted from https://gist.github.com/Dracovian/cb923c2b2fff7bad07ff7da4cdb6a3f8

If a message contains a blacklisted URL, remove it and log it.
