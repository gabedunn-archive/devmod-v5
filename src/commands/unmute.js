/*
* Gabe Dunn 2018
* Command that unmutes a user.
*/

import { orange } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { mutedRole } from '../utils/config'

// Export an object with command info and the function to execute.
export const unmuteCommand = {
  name: 'Unmute',
  aliases: ['unmute'],
  category: 'moderation',
  description: 'Remove a muted role from a user.',
  permissions: ['KICK_MEMBERS'],
  usage: 'unmute <user>',
  exec: async (args, message) => {
    // If a user isn't specified send an error message and terminate the command.
    if (args.length < 1) {
      await message.react('❌')
      return sendErrorMessage('User Not Specified', 'You didn\'t specify a user to unmute.', message)
    }

    // Save the user object of the member to be unmuted.
    const member = message.mentions.members.first()

    // If the user doesn't exist send an error message and terminate the command.
    if (member === null) {
      await message.react('❌')
      return sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
    }

    // Save the server to a variable.
    const guild = message.guild

    // Fetch the muted role from the server.
    const muted = guild.roles.find(r => r.name === mutedRole)

    // If the muted role doesn't exist, send an error message and terminate the command.
    if (muted === null) {
      await message.react('❌')
      return sendErrorMessage('Muted Role Doesn\'t Exist', 'The muted role specified in the config does not exist.', message)
    }

    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

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

    // Log the unmute to the current channel.
    // noinspection JSUnresolvedFunction
    await message.channel.send({
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
  }
}
