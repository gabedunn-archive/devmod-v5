/*
 * Gabe Dunn 2019
 * Functionality relating to listening and logging thanks.
 */

import { log, logError } from '../utils/log'
import { incrementThanks } from '../db'
import { green } from '../utils/colours'

export const initThanksListener = client => {
  try {
    // For each message run a function.
    client.on('message', async message => {
      try {
        // If the message isn't a dm, the author isn't a bot, and it contains the word 'thank' or 'kudos', continue.
        if (message.channel.type !== 'dm' && !message.author.bot && ['thank', 'kudos'].some(t => message.content.includes(t))) {

          // Get the member thanked.
          const thankee = message.mentions.members.first()

          // If the member exists, continue.
          if (thankee !== undefined) {
            // Save the thanker.
            const thanker = message.member
            try {
              // Increment the thanks for the user.
              const thanks = await incrementThanks(thankee.id, thanker.id)
              try {
                // Send a confirmation message.
                return message.channel.send({
                  embed: {
                    title: 'Thanks Received!',
                    color: green,
                    description: `${thankee} has been thanked by ${thanker}!\n\nThey now have ${thanks} rep.`,
                    author: {
                      name: thanker.nickname ? thanker.nickname : thanker.user.username,
                      icon_url: thanker.user.avatarURL
                    },
                    footer: {
                      icon_url: thankee.user.avatarURL,
                      text: `${thankee.nickname ? thankee.nickname : thankee.user.username} has been thanked.`
                    },
                    timestamp: new Date()
                  }
                })
              } catch (err) {
                logError('Thanks', 'Failed to send message', err)
              }
            } catch (err) {
              logError('Thanks', 'Failed to log the thanks', err)
            }

            log('Thanks', thanker.id)
          }
        }
      } catch (err) {
        logError('Thanks', 'Failed to run listener', err)
      }
    })
    log('Init', 'Thanks listener initialized!')
  } catch (err) {
    logError('CommandListener', 'Failed to initialize the command listener', err)
  }
}
