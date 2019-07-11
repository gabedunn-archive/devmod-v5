/*
* Gabe Dunn 2018
* Command that sends an info message to the info channel.
*/

import { channels } from '../utils/config'
import { getSetting, setSetting } from '../db'
import chalk from 'chalk'

// Export an object with command info and the function to execute.
export const buildInfoCommand = {
  name: 'Build Info',
  aliases: ['buildInfo', 'build-info', 'buildinfo'],
  category: 'utils',
  description: 'Sends an info message to the info channel.',
  permissions: ['ADMINISTRATOR'],
  usage: 'buildInfo',
  exec: async (args, message) => {
    // Save the message's channel.
    const channel = message.channel

    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Fetch the most recent messages from the channel.
    const infoMessages = (await channel.fetchMessages({ limit: 10 }))
      .map(message => message.content)
      .reverse()

    // Save the server.
    const guild = message.guild

    // Find the info channel.
    const infoChannel = guild.channels.find(c => c.name === channels.info)

    // Save the previous info messages.
    const previousInfoMessages = await getSetting('info_message_ids')

    // Delete the previous info messages if they exist.
    for (const messageID of Object.values(previousInfoMessages)) {
      const message = await infoChannel.fetchMessage(messageID)
      await message.delete()
    }

    // Initialize an array for message IDs.
    const infoMessageIDs = []
    let verifyMessage

    // For each message, send it to the info channel.
    for (const message of infoMessages) {
      // Sent the message and save it.
      const sentMessage = await infoChannel.send(message)

      // Push the message ID to the array of message IDs.
      infoMessageIDs.push(sentMessage.id)

      // If the message contains the string, save its ID and react with a checkmark.
      if (message.includes('You agree to this')) {
        verifyMessage = sentMessage.id
        await sentMessage.react('✅')
      }
    }

    try {
      // Save the infoMessages to the database.
      await setSetting('info_message_ids', infoMessageIDs)
      await setSetting('verify_message_id', verifyMessage)
      console.log(`${chalk.greenBright('[BuildInfo]')} ${chalk.blue('Successfully build info message(s).')}`)
    } catch (err) {
      console.error('Error pushing messageIDs to database:', err)
    }

    try {
      // Send the about message embed.
      // noinspection JSUnresolvedFunction
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }
}
