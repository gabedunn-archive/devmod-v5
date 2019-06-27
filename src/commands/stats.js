/*
* Gabe Dunn 2018
* Command that sends some stats about the bot and server.
*/

import moment from 'moment'

import { blue } from '../utils/colours'

// Export an object with command info and the function to execute.
export const statsCommand = {
  name: 'Stats',
  aliases: ['stats', 'statistics'],
  category: 'utils',
  description: 'Sends some stats about the bot and server.',
  permissions: ['SEND_MESSAGES'],
  usage: 'stats',
  exec: async (args, message) => {
    // Save some info about the server and bot.
    const guild = message.guild
    const client = message.client
    const uptime = moment.duration(client.uptime)

    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Send the stats message.
    // noinspection JSUnresolvedFunction
    return message.channel.send({
      embed: {
        title: 'Server Stats',
        color: blue,
        author: {
          name: message.member.user.username,
          icon_url: message.member.user.avatarURL
        },
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
  }
}
