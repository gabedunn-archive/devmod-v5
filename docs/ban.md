# Ban

## Usage
`.ban <user> [<reason> <--rm days>]`

Bans a user and removes their messages from a specified number of days previous,
and log it to the channel specified in `channels.bans`.

To specify a number of days, pass the argument `--rm` followed immediately by
the number of days you want to specify, for example `--rm 7` to delete messages
from the past week. This can be included anywhere in the arguments after the 
user is tagged.

If there isn't a number of days specified, use the in `banMsgDelete` field from
the config.

You can unban a user with the [unban](./unban.md) command.

## Permission Requirements
`['BAN_MEMBERS']`

## Author
**devmod** © [RedXTech](https://github.com/redxtech), Released under the [MIT](../LICENSE.md) License.
