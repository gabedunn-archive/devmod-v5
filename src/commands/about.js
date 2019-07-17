/*
* Gabe Dunn 2018
* Command that sends some info about the bot.
*/

import { blue } from '../utils/colours'
import { logError } from '../utils/log'
import { getAuthor } from '../utils/user'

// Export an object with command info and the function to execute.
export const aboutCommand = {
  name: 'About',
  aliases: ['about', 'info'],
  category: 'utils',
  description: 'Tells a little bit about the bot.',
  permissions: ['SEND_MESSAGES'],
  exec: async (args, message) => {
    try {
      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('About', 'Failed to delete message', err, message)
      }

      try {
        // Send the about message embed.
        // noinspection JSUnresolvedFunction
        return message.channel.send({
          embed: {
            title: 'devmod - about the bot',
            color: blue,
            url: 'https://github.com/redxtech/devmod',
            description: 'devmod is a bot made for the DevCord community, but is applicable to any server that needs ' +
              'moderating. It is written with discord.js. To use it on your own server, follow the steps in the ' +
              'GitHub repo.',
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
            author: getAuthor(message.member),
            timestamp: new Date()
          }
        })
      } catch (err) {
        await logError('About', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('About', 'Failed to run command', err, message)
    }
  }
}
