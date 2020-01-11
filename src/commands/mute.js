/*
* Gabe Dunn 2018
* Command that mutes a user.
*/

import { orange } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { logError } from '../utils/log'
import { getAuthor, getName } from '../utils/user'

const { channels: { warn }, roles: { muted } } = require('../utils/config').default

// Export an object with command info and the function to execute.
export const muteCommand = {
  name: 'Mute',
  aliases: ['mute', 'silence'],
  category: 'moderation',
  description: 'Applied a muted role to a user.',
  permissions: ['KICK_MEMBERS'],
  usage: '<user>',
  exec: async (args, message) => {
    try {
      // If a user isn't specified send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('User Not Specified', 'You didn\'t specify a user to mute.', message)
      }

      // Save the user object of the member to be muted.
      const member = message.mentions.members.first()

      // If the user doesn't exist send an error message and terminate the command.
      if (member === undefined) {
        return await sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
      }

      // Save the server to a variable.
      const guild = message.guild

      // Fetch the muted role from the server.
      const mutedRole = guild.roles.find(r => r.name === muted)

      // If the muted role doesn't exist, send an error message and terminate the command.
      if (mutedRole === undefined) {
        return await sendErrorMessage('Muted Role Doesn\'t Exist', 'The muted role specified in the config does not exist.', message)
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Mute', 'Failed to delete message', err, message)
      }

      try {
        // Add the muted role to the member.
        await member.addRole(mutedRole)
      } catch (err) {
        await logError('Mute', 'Failed to add muted role', err, message)
      }

      // Save some info about the staff member.
      const staffMember = message.member

      // Save the warnings channel.
      const warnChannel = guild.channels.find(c => c.name === warn)

      try {
        // Log the mute to the warnings channel.
        return warnChannel.send({
          embed: {
            color: orange,
            title: 'Mute',
            description: `${getName(member)} (${member.user.tag} - ${member}) has been muted.`,
            author: getAuthor(staffMember),
            timestamp: new Date()
          }
        })
      } catch (err) {
        await logError('Mute', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('Mute', 'Failed to run command', err, message)
    }
  }
}
