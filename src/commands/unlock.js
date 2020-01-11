/*
* Gabe Dunn 2018
* Command that unlocks a channel.
*/

import { green } from '../utils/colours'
import { logError } from '../utils/log'
import { getAuthor } from '../utils/user'

const { roles: { verified } } = require('../utils/config').default

// Export an object with command info and the function to execute.
export const unlockCommand = {
  name: 'Unlock',
  aliases: ['unlock'],
  category: 'utils',
  description: 'Unlocks the current channel.',
  permissions: ['MANAGE_CHANNELS'],
  exec: async (args, message) => {
    try {
      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Unlock', 'Failed to delete message', err, message)
      }

      const channel = message.channel
      const guild = message.guild
      const verifiedRole = guild.roles.find(r => r.name === verified)

      for (const role of [verifiedRole, guild.defaultRole]) {
        await channel.overwritePermissions(role, {
          SEND_MESSAGES: null
        }, 'Unlocking the channel')
      }

      try {
        // Send the lock embed.
        return message.channel.send({
          embed: {
            title: 'Channel Unlocked',
            color: green,
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
