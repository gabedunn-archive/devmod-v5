/*
* Gabe Dunn 2018
* Command that unbans a member.
*/

import { sendErrorMessage } from '../utils/sendErrorMessage'
import { green } from '../utils/colours'
import { logError } from '../utils/log'
import { getAuthor, getName } from '../utils/user'

const { channels: { ban } } = require('../utils/config').default

// Export an object with command info and the function to execute.
export const unbanCommand = {
  name: 'Unban',
  aliases: ['unban'],
  category: 'moderation',
  description: 'Unbans a user.',
  permissions: ['BAN_MEMBERS'],
  usage: '<user>',
  exec: async (args, message) => {
    try {
      // If there aren't any args, send an error message stating a member wasn't specified and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('User Not Specified', 'You didn\'t specify a user to unban.', message)
      }

      const tagged = message.mentions.members.first()

      // Get the member tagged in the args.
      const member = tagged || args[0]

      // Save the server.
      const guild = message.guild

      // Grab the banned users from the guild.
      const bans = await guild.fetchBans(true)

      // Save the member who is to be unbanned.
      // noinspection JSUnresolvedVariable
      const memberToUnban = bans.find(m => `${m.user.username}#${m.user.discriminator}` === member || m.user.id === member)

      // If there isn't a banned member with that name, send an error message and terminate the command.
      if (memberToUnban === undefined) {
        return await sendErrorMessage('User Not Banned', 'The specified user either doesn\'t exist or isn\'t banned.', message)
      }

      // Save the banned reason.
      const reason = memberToUnban.reason

      // Save the ban channel.
      const channel = guild.channels.cache.find(c => c.name === ban)

      try {
        // Log the unban to the current channel.
        // noinspection JSCheckFunctionSignatures
        await channel.send({
          embed: {
            color: green,
            title: 'Unban',
            description: `${getName(memberToUnban)} has been unbanned.\nThey were previously banned for reason: ${reason}`,
            author: getAuthor(message.member),
            footer: {
              icon_url: memberToUnban.user.avatarURL(),
              text: `${getName(memberToUnban)} has been unbanned.`
            },
            timestamp: new Date()
          }
        })
      } catch (err) {
        await logError('Unban', 'Failed to log unban', err, message)
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Unban', 'Failed to delete message', err, message)
      }

      try {
        // Unban the user
        await guild.unban(memberToUnban.user, 'Unbanned by devmod.')
      } catch (err) {
        await logError('Unban', 'Failed to unban member', err, message)
      }
    } catch (err) {
      await logError('Unban', 'Failed to run command', err, message)
    }
  }
}
