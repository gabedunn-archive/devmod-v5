/*
* Gabe Dunn 2018
* Command that sends some info about the bot.
*/

import { blue } from '../utils/colours'
import { logError } from '../utils/log'

// Export an object with command info and the function to execute.
export const aboutCommand = {
  name: 'About',
  aliases: ['about', 'info'],
  category: 'utils',
  description: 'Tells a little bit about the bot.',
  permissions: ['SEND_MESSAGES'],
  exec: async (args, message) => {
    try {
      // Save the user who sent the message. 'member.user' if 'member' exists, otherwise 'author'.
      const user = message.member ? message.member.user : message.author

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        logError('About', 'Failed to delete message', err, message)
      }

      // Send the about message embed.
      // noinspection JSUnresolvedFunction
      return message.channel.send({
        embed: {
          title: 'DevMod - About the Bot',
          color: blue,
          url: 'https://github.com/redxtech/devmod',
          description: 'DevMod is a bot made for the DevCord community, but' +
            ' is applicable to any server that needs moderating. It is written' +
            ' with discord.js. To use it on your own' +
            ' server, follow the steps in the GitHub repo.',
          fields: [
            {
              name: 'Author:',
              value: '<@170451883134156800>',
              inline: true
            },
            {
              name: 'GitHub Repo:',
              value: 'https://github.com/redxtech/devmod',
              inline: true
            }
          ],
          author: {
            name: user.username,
            icon_url: user.avatarURL
          },
          timestamp: new Date()
        }
      })
    } catch (err) {
      logError('About', 'Failed to send message', err, message)
    }
  }
}
