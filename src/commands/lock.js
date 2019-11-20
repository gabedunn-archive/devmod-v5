/*
* Gabe Dunn 2018
* Command that locks a channel.
*/

import { red } from '../utils/colours'
import { logError } from '../utils/log'
import { getAuthor } from '../utils/user'

const { roles: { verified } } = require('../utils/config')['default']

// Export an object with command info and the function to execute.
export const lockCommand = {
  name: 'Lock',
  aliases: ['lock'],
  category: 'utils',
  description: 'Locks the current channel.',
  permissions: ['MANAGE_CHANNELS'],
  exec: async (args, message) => {
    try {
      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Lock', 'Failed to delete message', err, message)
      }

      const channel = message.channel
      const guild = message.guild
      const verifiedRole = guild.roles.find(r => r.name === verified)

      for (const role of [verifiedRole, guild.defaultRole]) {
        await channel.overwritePermissions(role, {
          'SEND_MESSAGES': false
        }, 'Locking the channel')
      }

      try {
        // Send the lock embed.
        return message.channel.send({
          embed: {
            title: 'Channel Locked',
            color: red,
            author: getAuthor(message.member),
            timestamp: new Date()
          }
        })
      } catch (err) {
        await logError('Lock', 'Failed to send message.', err, message)
      }
    } catch (err) {
      await logError('Lock', 'Failed to run command', err, message)
    }
  }
}
