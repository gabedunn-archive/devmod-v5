/*
* Gabe Dunn 2018
* Command that kills the bot.
*/

import { blue } from '../utils/colours'
import { log, logError } from '../utils/log'
import { getAuthor } from '../utils/user'

// Export an object with command info and the function to execute.
export const killCommand = {
  name: 'Kill',
  aliases: ['kill', 'die'],
  category: 'utils',
  description: 'Kills the bot\'s process.',
  permissions: ['ADMINISTRATOR'],
  exec: async (args, message) => {
    try {
      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Kill', 'Failed to delete message', err, message)
      }

      try {
        // Send the kill embed.
        // noinspection JSUnresolvedFunction
        await message.channel.send({
          embed: {
            title: 'Killing Bot...',
            color: blue,
            author: getAuthor(message.member),
            timestamp: new Date()
          }
        })
        log('Kill', 'Killing the bot...')
        process.exit(0)
      } catch (err) {
        await logError('Kill', 'Failed to kill process.', err, message)
      }
    } catch (err) {
      await logError('Kill', 'Failed to run command', err, message)
    }
  }
}
