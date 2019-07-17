/*
* Gabe Dunn 2018
* Command that sends a 'let me google that for you link'.
*/

import { blue } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { logError } from '../utils/log'
import { getAuthor } from '../utils/user'

// Export an object with command info and the function to execute.
export const lmgtfyCommand = {
  name: 'LMGTFY',
  aliases: ['lmgtfy'],
  category: 'fun',
  description: 'Sends a \'let me google that for you link\'.',
  permissions: ['SEND_MESSAGES'],
  usage: '<query>',
  exec: async (args, message) => {
    try {
      // If a query isn't specified, send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage(
          'No Query Specified', 'You need to specify a query.', message
        )
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('LMGTFY', 'Failed to delete message', err, message)
      }

      try {
        // Send a let me google that for you link in an embedded message.
        // noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
        return message.channel.send({
          embed: {
            title: args.join(' '),
            color: blue,
            url: `https://lmgtfy.com/?q=${args.join('+')}`,
            description: 'Here you go!',
            author: getAuthor(message.member)
          }
        })
      } catch (err) {
        await logError('LMGTFY', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('LMGTFY', 'Failed to run command', err, message)
    }
  }
}
