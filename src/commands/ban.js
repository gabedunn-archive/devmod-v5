/*
* Gabe Dunn 2018
* Command that bans a member.
*/

import { sendErrorMessage } from '../utils/sendErrorMessage'
import { red } from '../utils/colours'
import { banMsgDelete, channels } from '../utils/config'
import { logError } from '../utils/log'
import { getAuthor, getName } from '../utils/user'

// Export an object with command info and the function to execute.
export const banCommand = {
  name: 'Ban',
  aliases: ['ban'],
  category: 'moderation',
  description: 'Bans a user and removes their messages from a specified number of days previous.',
  permissions: ['BAN_MEMBERS'],
  usage: '<user> [<days> <reason>]',
  exec: async (args, message) => {
    try {
      // If there aren't any args, send an error message stating a member wasn't specified and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('User Not Specified', 'You didn\'t specify a user to ban.', message)
      }

      // Get the member tagged in the args.
      const member = message.mentions.members.first()

      // If there isn't a member with that name, send an error message and terminate the command.
      if (member === undefined) {
        return await sendErrorMessage('User Doesn\'t Exist', 'The specified user doesn\'t exist.', message)
      }

      // If the specified user is able to kick members (read: moderator) terminate the command.
      if (member.hasPermission('KICK_MEMBERS')) {
        return await sendErrorMessage(
          'Can\'t Ban Member',
          `${member} cannot be banned.`,
          message
        )
      }

      // TODo: move the days arg to after reason and make it with --rm
      // Save the days arg. If it doesn't exist, default to 0. If it isn't an int, default to the amount specified in the config.
      const days = args.length > 1
        ? isNaN(parseInt(args[1]))
          ? 0
          : parseInt(args[1])
        : banMsgDelete

      // Save the args remaining after the first two. If there aren't more than two args, default to 'Banned by devmod.'.
      const reason = args.length > 2 ? args.slice(2).join(' ') : 'Banned by devmod.'

      try {
        // Send the user a DM letting them know they've been banned.
        // noinspection JSUnresolvedFunction
        await member.user.send({
          embed: {
            title: `You have been banned from ${message.guild.name}.`,
            color: red,
            thumbnail: {
              url: message.guild.iconURL
            },
            fields: [
              {
                name: 'Reason:',
                value: reason
              }
            ],
            footer: {
              text: `Your messages from the past ${days === 1 ? ' day' : `${days} days`} have been deleted.`
            }
          }
        })
      } catch (err) {
        logError('Ban', 'Failed to send member message', err, message)
      }

      // Save some info about the staff member.
      const staffMember = message.member

      try {
        // Log the ban to the bans channel.
        await message.guild.channels
          .find(c => c.name === channels.ban)
          .send({
            embed: {
              color: red,
              title: 'Ban',
              description: `${getName(member)} (${member.user.tag} - ${member}) has been banned.`,
              author: getAuthor(staffMember),
              fields: [
                {
                  name: 'Reason:',
                  value: reason
                }
              ],
              footer: {
                icon_url: member.user.avatarURL,
                text: `${getName(member)}'s (${member.user.tag}'s) messages from the past ${days === 1 ? ' day' : `${days} days`} have been deleted.`
              },
              timestamp: new Date()
            }
          })
      } catch (err) {
        logError('Ban', 'Failed to log ban to channel', err, message)
      }

      try {
        // Ban the member.
        await member.ban({ days, reason })
      } catch (err) {
        logError('Ban', 'Failed to ban the member', err, message)
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        if (err.message !== 'Unknown Message') {
          logError('Ban', 'Failed to delete message', err, message)
        }
      }
    } catch (err) {
      logError('Ban', 'Failed to run command', err, message)
    }
  }
}
