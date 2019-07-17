/*
* Gabe Dunn 2018
* Command that unmutes a user.
*/

import { green } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { channels, roles } from '../utils/config'
import { logError } from '../utils/log'
import { getAuthor, getName } from '../utils/user'

// Export an object with command info and the function to execute.
export const unmuteCommand = {
  name: 'Unmute',
  aliases: ['unmute'],
  category: 'moderation',
  description: 'Remove a muted role from a user.',
  permissions: ['KICK_MEMBERS'],
  usage: '<user>',
  exec: async (args, message) => {
    try {
      // If a user isn't specified send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('User Not Specified', 'You didn\'t specify a user to unmute.', message)
      }

      // Save the user object of the member to be unmuted.
      const member = message.mentions.members.first()

      // If the user doesn't exist send an error message and terminate the command.
      if (member === undefined) {
        return await sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
      }

      // Save the server to a variable.
      const guild = message.guild

      // Fetch the muted role from the server.
      const muted = guild.roles.find(r => r.name === roles.muted)

      // If the muted role doesn't exist, send an error message and terminate the command.
      if (muted === undefined) {
        return await sendErrorMessage('Muted Role Doesn\'t Exist', 'The muted role specified in the config does not exist.', message)
      }

      try {
        // Remove the muted role from the member.
        await member.removeRole(muted)

        // Save the warnings channel.
        const channel = guild.channels.find(c => c.name === channels.warn)

        try {
          // Remove the user's message.
          await message.delete()
        } catch (err) {
          logError('Unmute', 'Failed to delete message', err, message)
        }

        try {
          // Log the unmute to the warnings channel.
          // noinspection JSUnresolvedFunction
          return channel.send({
            embed: {
              color: green,
              title: 'Unmute',
              description: `${getName(member)} (${member.user.tag} - ${member}) has been unmuted.`,
              author: getAuthor(message.member),
              timestamp: new Date()
            }
          })
        } catch (err) {
          logError('Unmute', 'Failed to send message', err, message)
        }
      } catch (err) {
        logError('Unmute', 'Failed to remove role', err, message)
      }
    } catch (err) {
      logError('Unmute', 'Failed to run command', err, message)
    }
  }
}
