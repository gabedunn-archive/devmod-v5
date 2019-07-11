/*
* Gabe Dunn 2018
* Command that clears a user's warnings.
*/

import { blue } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { clearWarnings } from '../db'

// Export an object with command info and the function to execute.
export const clearWarnsCommand = {
  name: 'Clear Warns',
  aliases: ['clearWarns', 'clear-warns', 'cWarns', 'cwarns', 'c-warns'],
  category: 'moderation',
  description: 'Clears a user\'s warnings.',
  permissions: ['KICK_MEMBERS'],
  usage: 'clearwarns <user>',
  exec: async (args, message) => {
    // If a user isn't specified send an error message and terminate the command.
    if (args.length < 1) {
      await message.react('❌')
      return sendErrorMessage('User Not Specified', 'You didn\'t specify a user to clear their warnings.', message)
    }

    // Save the user object of the member to clear their warnings.
    // noinspection DuplicatedCode
    const member = message.mentions.members.first()

    // If the user doesn't exist send an error message and terminate the command.
    if (member === null) {
      await message.react('❌')
      return sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
    }

    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Save some information about the user.
    const user = member.user
    const name = member.nickname ? member.nickname : user.username

    // Clear the warnings from the database.
    await clearWarnings(user.id)

    // Save some info about the staff member.
    const staffMember = message.member
    const staffUser = staffMember.user
    const staffName = staffMember.nickname ? staffMember.nickname : staffUser.username

    // Send a confirmation message.
    // noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
    await message.channel.send({
      embed: {
        color: blue,
        title: 'Warnings Cleared',
        description: `${name}'s (${user.tag}'s) warnings have been cleared.`,
        author: {
          name: `${staffName} (${staffUser.tag})`,
          icon_url: staffUser.avatarURL
        },
        footer: {
          icon_url: user.avatarURL,
          text: `${name}'s (${user.tag}'s) warnings have been cleared.`
        },
        timestamp: new Date()
      }
    })
  }
}
