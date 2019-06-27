/*
* Gabe Dunn 2018
* Command that sends a 'let me google that for you link'.
*/

import { blue } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'

// Export an object with command info and the function to execute.
export const lmgtfyCommand = {
  name: 'LMGTFY',
  aliases: ['lmgtfy'],
  category: 'fun',
  description: 'Sends a \'let me google that for you link\'.',
  permissions: ['SEND_MESSAGES'],
  usage: 'lmgtfy <query>',
  exec: async (args, message) => {
    // If a query isn't specified, send an error message and terminate the command.
    if (args.length < 1) {
      await message.react('❌')
      return sendErrorMessage(
        'No Query Specified', 'You need to specify a query.', message
      )
    }

    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Send a let me google that for you link in an embedded message.
    // noinspection JSUnresolvedFunction
    return message.channel.send({
      embed: {
        title: args.join(' '),
        color: blue,
        url: `https://lmgtfy.com/?q=${args.join('+')}`,
        description: 'Here you go!',
        author: {
          name: message.member.user.username,
          icon_url: message.member.user.avatarURL
        }
      }
    })
  }
}
