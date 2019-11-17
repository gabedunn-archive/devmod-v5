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
  usage: '<query> [<site> <web|image>]',
  exec: async (args, message) => {
    // Set up type and site options.
    const types = {
      '-w': 'w', // web
      '-i': 'i' // image
    }
    const sites = {
      '-g': 'g', // google
      '-y': 'y', //yahoo
      '-b': 'b', // bing
      '-k': 'k', // ask
      '-a': 'a', // aol
      '-d': 'd' // duckduckgo
    }
    try {
      // Set default options to web & google.
      let type = types['-w']
      let site = sites['-g']

      // If a query isn't specified, send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage(
          'No Query Specified', 'You need to specify a query.', message
        )
      }

      const query = args.filter(a => a[0] !== '-')
      const options = args.filter(args => args[0] === '-')

      // If the specified options exists, set them.
      for (const option of options) {
        if (Object.keys(sites).includes(option.toLowerCase())) {
          site = sites[option]
        }
      }

      // LMGTFY only supports image for google searches
      if (site === 'g') {
        for (const option of options) {
          if (Object.keys(types).includes(option.toLowerCase())) {
            type = types[option]
          }
        }
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
            title: query.join(' '),
            color: blue,
            url: `https://lmgtfy.com/?q=${query.join('+')}&s=${site}&t=${type}`,
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
