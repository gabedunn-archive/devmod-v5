/*
* Gabe Dunn 2018
* Command that reports a member to the staff.
*/

import { blue, orange } from '../utils/colours'
import { channels } from '../utils/config'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { logError } from '../utils/log'

// Export an object with command info and the function to execute.
export const reportCommand = {
  name: 'Report',
  aliases: ['report', 'snitch'],
  category: 'moderation',
  description: 'Reports a user to the staff.',
  permissions: ['SEND_MESSAGES'],
  usage: 'report <user> <reason>',
  exec: async (args, message) => {
    try {
      // If there aren't any args, send an error message stating a member wasn't specified and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('User Not Specified', 'You didn\'t specify a user to ban.', message)
      }

      // Get the member tagged in the args.
      const memberReported = message.mentions.members.first()

      if (args.length < 1) {
        return await sendErrorMessage('Reason Not Specified', 'You didn\'t specify a reason for reporting the user.', message)
      }

      // Save the args remaining after the first two. If there aren't more than two args, default to 'Banned by devmod.'.
      const reason = args.slice(1).join(' ')

      // Save the user who sent the message. 'member.user' if 'member' exists, otherwise 'author'.
      const user = message.member ? message.member.user : message.author

      try {
        // Create a DM channel to send a message to.
        const dmChannel = await user.createDM()

        try {
          // Send the user a DM thanking them for reporting the user.
          await dmChannel.send({
            embed: {
              title: 'Thanks for the Report!',
              color: blue,
              description: `Thanks for reporting <@${memberReported.id}> for reason: \`${reason}\`. The staff have been notified.`,
              timestamp: new Date()
            }
          })
        } catch (err) {
          logError('Report', 'Failed to send thanks message', err, message)
        }
      } catch (err) {
        logError('Report', 'Failed to create DM channel', err, message)
      }

      // Save the current server.
      const guild = message.guild

      // Save the reports channel.
      const reportsChannel = guild.channels.find(c => c.name === channels.report)

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        logError('Report', 'Failed to delete message', err, message)
      }

      try {
        // Send the report message to the proper channel.
        // noinspection JSUnresolvedFunction
        return reportsChannel.send({
          embed: {
            title: 'New Report',
            color: orange,
            description: reason,
            fields: [
              {
                name: 'Member Reported:',
                value: `<@${memberReported.id}>`,
                inline: true
              },
              {
                name: 'Channel:',
                value: `<#${message.channel.id}>`,
                inline: true
              }
            ],
            author: {
              name: user.username,
              icon_url: user.avatarURL
            },
            footer: {
              icon_url: user.avatarURL,
              text: `${memberReported.user.tag} reported from #${message.channel.name} by ${user.tag}.`
            },
            timestamp: new Date()
          }
        })
      } catch (err) {
        logError('Report', 'Failed to send message', err, message)
      }
    } catch (err) {
      logError('Report', 'Failed to run command', err, message)
    }
  }
}
