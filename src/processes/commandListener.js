/*
 * Gabe Dunn 2019
 * Functionality relating to listening to messages and running commands.
 */

import { commands } from '../commands'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { log, logError } from '../utils/log'

const { prefix } = require('../utils/config')['default']

export const initCommandListener = async client => {
  try {
    // For each message run a function.
    client.on('message', async msg => {
      // If the message isn't a dm, the first character is the prefix, and the author isn't a bot, continue.
      if (msg.channel.type !== 'dm' && msg.content[0] === prefix && !msg.author.bot) {
        // Separate the entire command after the prefix into args.
        const args = msg.content.substr(1).split(' ')

        // Set the command to the first argument and remove it from the args array.
        const command = args.shift()

        // If the command exists, test for permissions and run the command function.
        if (commands.hasOwnProperty(command)) {
          // Save the command to a variable.
          const cmd = commands[command]
          try {
            // Test that the users has the proper permissions to run the command.
            if (msg.member.permissions.has(cmd.permissions)) {
              try {
                // Run the command.
                cmd.exec(args, msg)
              } catch (err) {
                await logError('CommandListener', 'Failed to execute command', err)
              }
            } else {
              try {
                // Send error message.
                return await sendErrorMessage(
                  'Insufficient Permissions',
                  'You do not have permission to use that command.',
                  msg
                )
              } catch (err) {
                await logError('CommandListener', 'Failed to send error message', err)
              }
            }
          } catch (err) {
            await logError('CommandListener', 'Failed to test for permissions', err)
          }
        }
      }
    })
    log('Init', 'Command listener initialized!')
  } catch (err) {
    await logError('CommandListener', 'Failed to initialize the command listener', err)
  }
}
