# Help

## Usage
`.help [<user> <true>]`

Looks at all of the commands loaded, extract the name & usage information, and send it in
a message. The message will delete after `msgDeleteTime` seconds.

Only commands that the user has permission to use will be shown.

If a user is specified, the bot will tag that used in the message.

If `'true'` is included anywhere in the arguments, the message will not be deleted.

## Permission Requirements
`['SEND_MESSAGES']`

## Author
**devmod** © [RedXTech](https://github.com/redxtech), Released under the [MIT](../LICENSE.md) License.
