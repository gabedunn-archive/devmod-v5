/*
* Gabe Dunn 2018
* Command that shows how many users are on the server.
*/

import { blue } from '../utils/colours'

// Export an object with command info and the function to execute.
export const usersCommand = {
  name: 'Users',
  aliases: ['users', 'usercount'],
  category: 'utils',
  description: 'Shows how many users are on the server.',
  permissions: ['SEND_MESSAGES'],
  usage: 'users',
  exec: async (args, message) => {
    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Save some info about the server and bot.
    const guild = message.guild

    // Send the stats message.
    // noinspection JSUnresolvedFunction
    return message.channel.send({
      embed: {
        title: 'Users',
        color: blue,
        description: `There are currently ${guild.memberCount} users in this discord server (${guild.members.array().filter(
          m => m.presence.status !== 'offline').length} currently online).`,
        author: {
          name: message.member.user.username,
          icon_url: message.member.user.avatarURL
        }
      }
    })
  }
}
