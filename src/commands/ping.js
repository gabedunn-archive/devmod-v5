/*
* Gabe Dunn 2018
* Command that shows ping and round trip time for the bot.
*/

import { blue } from '../utils/colours'

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
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Create the initial embed to send.
    const embed = {
      title: 'Pong!',
      color: blue
    }
    // noinspection JSUnresolvedFunction
    const sent = await message.channel.send({ embed })
    try {
      // Calculate difference in time between when message was send & when it was edited.
      const timeDiff = (sent.createdAt) - (message.createdAt)
      // Create fields for the embed.
      embed.fields = [
        {
          name: 'Round Trip Time:',
          value: `${timeDiff}ms.`
        },
        {
          name: 'Ping:',
          value: `${Math.round(message.client.ping)}ms.`
        }
      ]
      // Edit the message.
      return await sent.edit({ embed })
    } catch (e) {
      console.log(`Error updating message: ${e}`)
      return null
    }
  }
}
