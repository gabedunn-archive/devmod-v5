/*
 * Gabe Dunn 2019
 * Functionality relating to listening and logging thanks.
 */

import { log, logError } from '../utils/log'
import { incrementThanks } from '../db'
import { green } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'

export const initThanksListener = async client => {
  try {
    // For each message run a function.
    client.on('message', async message => {
      try {
        // If the message isn't a dm, the author isn't a bot, and it contains the word 'thank' or 'kudos', continue.
        if (message.channel.type !== 'dm' && !message.author.bot && ['thank', 'kudos'].some(t => message.content.toLowerCase().includes(t))) {
          // Get the member thanked.
          const thankee = message.mentions.members.first()

          // If the member exists, continue.
          if (thankee !== undefined) {
            // Save the thanker.
            const thanker = message.member

            // If the member thanks themselves, send an error message.
            if (thankee.user.id === thanker.user.id) {
              return await sendErrorMessage('You Can\'t Thank Yourself!', 'You can see how that would be an issue, yes?', message)
            }

            try {
              // Increment the thanks for the user.
              const thanks = await incrementThanks(thankee.id, thanker.id)
              try {
                // Send a confirmation message.
                return message.channel.send({
                  embed: {
                    title: 'Thanks received!',
                    color: green,
                    description: `${thankee} has been thanked by ${thanker}!\n\nThey now have ${thanks} rep.`,
                    footer: {
                      text: `Use "thanks @user" to give someone rep!`
                    },
                  }
                })
              } catch (err) {
                await logError('Thanks', 'Failed to send message', err)
              }
            } catch (err) {
              await logError('Thanks', 'Failed to log the thanks', err)
            }

            log('Thanks', thanker.id)
          }
        }
      } catch (err) {
        await logError('Thanks', 'Failed to run listener', err)
      }
    })
    log('Init', 'Thanks listener initialized!')
  } catch (err) {
    // noinspection ES6MissingAwait
    logError('CommandListener', 'Failed to initialize the command listener', err)
  }
}
