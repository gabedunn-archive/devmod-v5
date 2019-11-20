# Warn

## Usage
`.warn <user> [<reason>]`

Adds a warning to the user. If no reason is specified, `'warned by devmod'` is used.
The warning is logged in `channels.warn`.

If `autoBan` is true and the user's warnings after this one are equal to `autoBanWarns`,
the user will be banned, their messages from the path `banMsgDelete` days, and the ban
will be logged to `channels.ban`.

You can clear a user's warnings with the [clear warns](./clearwarns.md) command.

You can list a user's warnings with the [warns](./warns.md) command.

## Permission Requirements
`['KICK_MEMBERS']`

## Author
**devmod** © [RedXTech](https://github.com/redxtech), Released under the [MIT](../LICENSE.md) License.
