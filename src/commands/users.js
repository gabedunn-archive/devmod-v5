/*
* Gabe Dunn 2018
* Command that shows how many users are on the server.
*/

import { blue } from '../utils/colours'
import { logError } from '../utils/log'
import { getAuthor } from '../utils/user'

// Export an object with command info and the function to execute.
export const usersCommand = {
  name: 'Users',
  aliases: ['users', 'usercount'],
  category: 'utils',
  description: 'Shows how many users are on the server.',
  permissions: ['SEND_MESSAGES'],
  exec: async (args, message) => {
    try {
      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Users', 'Failed to delete message', err, message)
      }

      // Save some info about the server and bot.
      const guild = message.guild

      try {
        // Send the stats message.
        // noinspection JSUnresolvedFunction
        return message.channel.send({
          embed: {
            title: 'Users',
            color: blue,
            description: `There are currently ${guild.memberCount} users in this discord server (${guild.members.array().filter(
              m => m.presence.status !== 'offline').length} currently online).`,
            author: getAuthor(message.member)
          }
        })
      } catch (err) {
        await logError('Users', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('Users', 'Failed to run command', err, message)
    }
  }
}
