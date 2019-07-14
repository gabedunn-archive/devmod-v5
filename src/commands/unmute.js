/*
* Gabe Dunn 2018
* Command that unmutes a user.
*/

import { orange } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { mutedRole } from '../utils/config'
import { logError } from '../utils/log'

// Export an object with command info and the function to execute.
export const unmuteCommand = {
  name: 'Unmute',
  aliases: ['unmute'],
  category: 'moderation',
  description: 'Remove a muted role from a user.',
  permissions: ['KICK_MEMBERS'],
  usage: 'unmute <user>',
  exec: async (args, message) => {
    try {
      // If a user isn't specified send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('User Not Specified', 'You didn\'t specify a user to unmute.', message)
      }

      // Save the user object of the member to be unmuted.
      const member = message.mentions.members.first()

      // If the user doesn't exist send an error message and terminate the command.
      if (member === null) {
        return await sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
      }

      // Save the server to a variable.
      const guild = message.guild

      // Fetch the muted role from the server.
      const muted = guild.roles.find(r => r.name === mutedRole)

      // If the muted role doesn't exist, send an error message and terminate the command.
      if (muted === null) {
        return await sendErrorMessage('Muted Role Doesn\'t Exist', 'The muted role specified in the config does not exist.', message)
      }

      try {
        // Remove the muted role from the member.
        await member.removeRole(muted)

        // Save the user to a variable.
        const user = member.user

        // Save the user's name.
        const name = member.nickname ? member.nickname : user.username

        // Save some info about the staff member.
        const staffMember = message.member
        const staffUser = staffMember.user
        const staffName = staffMember.nickname ? staffMember.nickname : staffUser.username

        try {
          // Remove the user's message.
          await message.delete()
        } catch (err) {
          logError('Unmute', 'Failed to delete message', err, message)
        }

        try {
          // Log the unmute to the current channel.
          // noinspection JSUnresolvedFunction
          return message.channel.send({
            embed: {
              color: orange,
              title: 'Unmute',
              description: `${name} (${user.tag}) has been unmuted.`,
              author: {
                name: `${staffName} (${staffUser.tag})`,
                icon_url: staffUser.avatarURL
              },
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
