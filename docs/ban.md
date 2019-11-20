# Ban

## Usage
`.ban <user> [<days> <reason>]`

Bans a user and removes their messages from a specified number of days previous,
and log it to the channel specified in `channels.bans`.

If there isn't a number of days specified, use the in `banMsgDelete` field from
the config.

You can unban a user with the [unban](./unban.md) command.

## Permission Requirements
`['BAN_MEMBERS']`

## Author
**devmod** © [RedXTech](https://github.com/redxtech), Released under the [MIT](../LICENSE.md) License.
