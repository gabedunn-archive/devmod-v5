# Build Info

## Usage
`.buildinfo`

Sends an info message to the info channel. Reads up to 10 messages from the channel the
command was sent and copies them to the channel specified in the config's `channels.info`

If there's a message that contains the string "You agree to this" a checkmark reaction is
added to it's copy, the message ID is saved to the database, and the info reaction listener
listens to reactions to it.

## Permission Requirements
`['ADMINISTRATOR']`

## Author
**devmod** © [RedXTech](https://github.com/redxtech), Released under the [MIT](../LICENSE.md) License.
