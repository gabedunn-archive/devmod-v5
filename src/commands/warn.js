/*
* Gabe Dunn 2018
* Command that warns a user.
*/

import { orange, red, yellow } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { autoBan, autoBanWarns, banMsgDelete, channels } from '../utils/config'
import { addWarning, getWarnings } from '../db'
import { banCommand } from './ban'
import { logError } from '../utils/log'
import { getAuthor, getName } from '../utils/user'

// Export an object with command info and the function to execute.
export const warnCommand = {
  name: 'Warn',
  aliases: ['warn', 'addwarn'],
  category: 'moderation',
  description: 'Warns a user.',
  permissions: ['KICK_MEMBERS'],
  usage: '<user> [<reason>]',
  exec: async (args, message) => {
    try {
      // If a user isn't specified send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('User Not Specified', 'You didn\'t specify a user to warn.', message)
      }

      // Save the user object of the member to be warned.
      // noinspection DuplicatedCode
      const member = message.mentions.members.first()

      // If the user doesn't exist send an error message and terminate the command.
      if (member === undefined) {
        return await sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
      }

      try {
        // If the specified user is able to kick members (read: moderator) terminate the command.
        if (member.hasPermission('KICK_MEMBERS')) {
          return await sendErrorMessage(
            'Can\'t Warn Member',
            'You are not allowed to warn that member.',
            message
          )
        }
      } catch (err) {
        logError('Warn', 'Failed to check user permissions', err, message)
      }

      const reason = args.length > 1 ? args.slice(1).join(' ') : 'warned by devmod'

      // Save some info about the staff member.
      const staffMember = message.member

      // Pull current warnings from the database.
      const currentWarnings = await getWarnings(member.user.id)

      try {
        // Log the warning to the database.
        await addWarning(member.user.id, reason, staffMember.user.id)
      } catch (err) {
        logError('Warn', 'Failed to log warning', err, message)
      }

      // Select the colour based on the number of previous warnings.
      const colour = currentWarnings.length < 1
        ? yellow
        : currentWarnings.length < 2
          ? orange
          : red

      try {
        // Log the warn to the current channel.
        // noinspection JSUnresolvedFunction
        await message.guild.channels
          .find(c => c.name === channels.warn)
          .send({
            embed: {
              color: colour,
              title: `Warning #${currentWarnings.length + 1}`,
              description: `${getName(member)} (${member.user.tag} - ${member}) has been warned for: ${reason}.`,
              author: getAuthor(staffMember),
              footer: {
                icon_url: member.user.avatarURL,
                text: `${getName(member)}'s (${member.user.tag}'s) has been warned.`
              },
              timestamp: new Date()
            }
          })
      } catch (err) {
        logError('Warn', 'Failed to log warn', err, message)
      }

      try {
        // Create a dm channel to the user.
        const dm = await member.user.createDM()

        // Send a dm to the user letting them know they've been warned.
        await dm.send({
          embed: {
            title: `You have received a warning on ${message.guild.name}.`,
            color: colour,
            author: getAuthor(member.client.user),
            thumbnail: {
              url: message.guild.iconURL
            },
            fields: [
              {
                name: 'Reason:',
                value: reason
              }
            ]
          }
        })
      } catch (err) {
        logError('Warn', 'Failed to DM user', err, message)
      }

      // If autoban is enabled, see if the user should be banned.
      if (autoBan) {
        // If the number of warnings passes the specified threshold, ban the user.
        if (currentWarnings.length + 1 >= autoBanWarns) {
          try {
            // Run the ban command.
            await banCommand.exec([args[0], banMsgDelete, ...'Exceeded maximum warnings'.split(' ')], message)
          } catch (err) {
            logError('Warn', 'Failed to autoban user', err, message)
          }
        }
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        logError('Warn', 'Failed to delete message', err, message)
      }
    } catch (err) {
      logError('Warn', 'Failed to run command', err, message)
    }
  }
}
