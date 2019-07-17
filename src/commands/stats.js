/*
* Gabe Dunn 2018
* Command that sends some stats about the bot and server.
*/

import moment from 'moment'

import { blue } from '../utils/colours'
import { logError } from '../utils/log'
import { getAuthor } from '../utils/user'

// Export an object with command info and the function to execute.
export const statsCommand = {
  name: 'Stats',
  aliases: ['stats', 'statistics'],
  category: 'utils',
  description: 'Sends some stats about the bot and server.',
  permissions: ['SEND_MESSAGES'],
  exec: async (args, message) => {
    try {
      // Save some info about the server and bot.
      const guild = message.guild
      const client = message.client
      const uptime = moment.duration(client.uptime)

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Stats', 'Failed to delete message', err, message)
      }

      try {
        // Send the stats message.
        // noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
        return message.channel.send({
          embed: {
            title: 'Server Stats',
            color: blue,
            author: getAuthor(message.member),
            fields: [
              {
                name: `${guild.name}:`,
                value: `Members: ${guild.memberCount}\n` +
                  `Server was created at: ${moment(guild.createdAt).format('YYYY/M/D')}\n` +
                  `Num. of channels: ${guild.channels.array().filter(channel => channel.type !== 'category').length}\n` +
                  `Region: ${guild.region}\n` +
                  `AFK Timeout: ${guild.afkTimeout}s\n`
              },
              {
                name: 'Bot Information:',
                value: `Uptime: ${uptime.hours()} hours, ${uptime.minutes()} mins, ${uptime.seconds()}s`
              }
            ]
          }
        })
      } catch (err) {
        await logError('Stat', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('Stats', 'Failed to run command', err, message)
    }
  }
}
