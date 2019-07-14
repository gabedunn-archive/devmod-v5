/*
* Gabe Dunn 2018
* Command that shows ping and round trip time for the bot.
*/

import { blue } from '../utils/colours'
import { logError } from '../utils/log'

// Export an object with command info and the function to execute.
export const pingCommand = {
  name: 'Ping',
  aliases: ['ping'],
  category: 'utils',
  description: 'Shows ping and round trip time for the bot.',
  permissions: ['SEND_MESSAGES'],
  usage: 'ping',
  exec: async (args, message) => {
    try {
      // Create the initial embed to send.
      const embed = {
        title: 'Pong!',
        color: blue,
        fields: [{
          name: 'Ping:',
          value: `${Math.round(message.client.ping)}ms.`
        }]
      }

      try {
        // noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
        const sent = await message.channel.send({ embed })
        try {
          // Calculate difference in time between when message was send & when it was edited.
          const timeDiff = (sent.createdAt) - (message.createdAt)
          // Create fields for the embed.
          embed.fields.push({
            name: 'Round Trip Time:',
            value: `${timeDiff}ms.`
          })
          // Edit the message.
          return await sent.edit({ embed })
        } catch (err) {
          logError('Ping', 'Error updating message', err, message)
          return null
        }
      } catch (err) {
        logError('Ping', 'Failed to send message', err, message)
      }
      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        logError('Ping', 'Failed to delete message', err, message)
      }
    } catch (err) {
      logError('Ping', 'Failed to run command', err, message)
    }
  }
}
