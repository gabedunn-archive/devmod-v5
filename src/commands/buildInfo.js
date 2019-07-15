/*
* Gabe Dunn 2018
* Command that sends an info message to the info channel.
*/

import { channels } from '../utils/config'
import { getSetting, setSetting } from '../db'
import chalk from 'chalk'
import { logError } from '../utils/log'
import { blue } from '../utils/colours'
import { getAuthor } from '../utils/user'

// Export an object with command info and the function to execute.
export const buildInfoCommand = {
  name: 'Build Info',
  aliases: ['buildinfo', 'buildInfo', 'build-info'],
  category: 'admin',
  description: 'Sends an info message to the info channel.',
  permissions: ['ADMINISTRATOR'],
  exec: async (args, message) => {
    try {
      // Save the message's channel.
      const channel = message.channel

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        logError('BuildInfo', 'Failed to delete message', err, message)
      }

      try {
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
          try {
            // noinspection JSCheckFunctionSignatures
            const message = await infoChannel.fetchMessage(messageID)
            await message.delete()
          } catch (err) {
            logError('BuildInfo', 'Failed to delete info message(s)', err, message)
          }
        }

        // Initialize an array for message IDs.
        const infoMessageIDs = []
        let verifyMessage

        // For each message, send it to the info channel.
        for (const message of infoMessages) {
          try {
            // Sent the message and save it.
            const sentMessage = await infoChannel.send(message)

            // Push the message ID to the array of message IDs.
            infoMessageIDs.push(sentMessage.id)

            // If the message contains the string, save its ID and react with a checkmark.
            if (message.includes('You agree to this')) {
              try {
                verifyMessage = sentMessage.id
                await sentMessage.react('✅')
              } catch (err) {
                logError('BuildInfo', 'Failed to add reaction', err, message)
              }
            }
          } catch (err) {
            logError('BuildInfo', 'Failed to send message', err, message)
          }
        }

        try {
          // Save the infoMessages to the database.
          await setSetting('info_message_ids', infoMessageIDs)
          await setSetting('verify_message_id', verifyMessage)
          console.log(`${chalk.greenBright('[BuildInfo]')} ${chalk.blue('Successfully built info message(s)!')}`)
        } catch (err) {
          logError('BuildInfo', 'Error pushing messageIDs to database', err, message)
        }

        try {
          // Send the confirmation message.
          // noinspection JSCheckFunctionSignatures
          return message.channel.send({
            embed: {
              title: 'Built Info Message',
              color: blue,
              description: `The info message has been built and is live in ${infoChannel}.`,
              author: getAuthor(message.member),
              timestamp: new Date()
            }
          })
        } catch (err) {
          logError('BuildInfo', 'Failed to send message', err, message)
        }
      } catch (err) {
        logError('BuildInfo', 'Failed to fetch messages', err, message)
      }
    } catch (err) {
      logError('BuildInfo', 'BuildInfo command failed', err, message)
    }
  }
}
