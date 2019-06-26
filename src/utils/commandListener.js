/*
 * Gabe Dunn 2019
 * Functionality relating to changing the bot's activity in the sidebar.
 */

import { commands } from '../commands'
import { prefix } from './config'

export const commandListenerInit = client => {
  try {
    // For each message run a function.
    client.on('message', msg => {
      // If the message isn't a dm, the first character is the prefix, and the author isn't a bot, continue.
      if (msg.channel.type !== 'dm' && msg.content[0] === prefix && !msg.author.bot) {
        // Separate the entire command after the prefix into args.
        const args = msg.content.substr(1).split(' ')

        // Set the command to the first argument and remove it from the args array.
        const command = args.shift()

        // If the command exists, run the command function.
        if (commands.hasOwnProperty(command)) {
          // Run the command.
          commands[command].exec(msg)
        }
      }
    })
  } catch (err) {
    console.error('Failed to initialize the command listener:', err)
  }
}
