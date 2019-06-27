/*
* Gabe Dunn 2018
* Command that bans a member.
*/

import { sendErrorMessage } from '../utils/sendErrorMessage'
import { red } from '../utils/colours'
import { channels } from '../utils/config'

// Export an object with command info and the function to execute.
export const banCommand = {
  name: 'Ban',
  aliases: ['ban'],
  category: 'moderation',
  description: 'Bans a user and removes their messages from a specified number of days previous.',
  permissions: ['BAN_MEMBERS'],
  exec: async (args, message) => {
    // If there aren't any args, send an error message stating a member wasn't specified and terminate the command.
    if (args.length < 1) {
      await message.react('❌')
      return sendErrorMessage('User Not Specified', 'You didn\'t specify a user to ban.', message)
    }

    // Get the member tagged in the args.
    const member = message.mentions.members.first()

    // If the specified user is able to kick members (read: moderator) terminate the command.
    if (member.hasPermission('KICK_MEMBERS')) {
      await message.react('❌')
      return sendErrorMessage(
        'Can\'t Ban Member',
        'You are not allowed to ban that member.',
        message
      )
    }

    // Save the days arg. If it doesn't exist, default to 0. If it isn't an int, default to 0.
    const days = args.length > 1
      ? isNaN(parseInt(args[1]))
        ? 0
        : parseInt(args[1])
      : 0

    // Save the args remaining after the first two. If there aren't more than two args, default to 'Banned by devmod.'.
    const reason = args.length > 2 ? args.slice(2).join(' ') : 'Banned by devmod.'

    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Save the user object of the member
    const user = member.user

    // Save the member's nickname if they have one, otherwise save name.
    const name = member.nickname ? member.nickname : user.username

    // Send the user a DM letting them know they've been banned.
    // noinspection JSUnresolvedFunction
    await user.send({
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
          text: `Your messages from the past ${days === 1 ? 'day' : `${days}s`} have been deleted.`
        }
      }
    })

    // Log the ban to the bans channel.
    await message.guild.channels
      .find(c => c.name === channels.ban)
      .send({
        embed: {
          color: red,
          title: 'Ban',
          description: `${name} (${user.tag}) has been banned.`,
          author: {
            name: `${name} (${member.user.tag})`,
            icon_url: member.user.avatarURL
          },
          fields: [
            {
              name: 'Reason:',
              value: reason
            }
          ],
          footer: {
            icon_url: user.avatarURL,
            text: `${name}'s (${user.tag}'s) messages from the past ${days === 1 ? 'day' : `${days}s`} have been deleted.`
          },
          timestamp: new Date()
        }
      })

    // Ban the user
    await member.ban({ days, reason })
  }
}
