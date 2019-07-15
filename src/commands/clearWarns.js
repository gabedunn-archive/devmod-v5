/*
* Gabe Dunn 2018
* Command that clears a user's warnings.
*/

import { blue } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { clearWarnings } from '../db'
import { logError } from '../utils/log'
import { getAuthor, getName } from '../utils/user'

// Export an object with command info and the function to execute.
export const clearWarnsCommand = {
  name: 'Clear Warns',
  aliases: ['clearwarns', 'clearWarns', 'clear-warns', 'cWarns', 'cwarns', 'c-warns'],
  category: 'moderation',
  description: 'Clears a user\'s warnings.',
  permissions: ['KICK_MEMBERS'],
  usage: '<user>',
  exec: async (args, message) => {
    try {
      // If a user isn't specified send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('User Not Specified', 'You didn\'t specify a user to clear their warnings.', message)
      }

      // Save the user object of the member to clear their warnings.
      // noinspection DuplicatedCode
      const member = message.mentions.members.first()

      // If the user doesn't exist send an error message and terminate the command.
      if (member === undefined) {
        return await sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
      }

      try {
        // Clear the warnings from the database.
        await clearWarnings(member.user.id)
      } catch (err) {
        logError('ClearWarns', 'Failed to clear warnings', err, message)
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        logError('ClearWarns', 'Failed to delete message', err, message)
      }

      // Save some info about the staff member.
      const staffMember = message.member

      try {
        // Send a confirmation message.
        // noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
        return message.channel.send({
          embed: {
            color: blue,
            title: 'Warnings Cleared',
            description: `${getName(member)}'s (${member.user.tag}'s) warnings have been cleared.`,
            author: getAuthor(staffMember),
            footer: {
              icon_url: member.user.avatarURL,
              text: `${getName(member)}'s (${member.user.tag}'s) warnings have been cleared.`
            },
            timestamp: new Date()
          }
        })
      } catch (err) {
        logError('ClearWarns', 'Failed to send message', err, message)
      }
    } catch (err) {
      logError('ClearWarns', 'Failed to run command', err, message)
    }
  }
}
