/*
 * Gabe Dunn 2019
 * Functionality relating to listening and logging thanks.
 * TODO: the thing
 */

import { log, logError } from '../utils/log'
import { incrementThanks } from '../db'
import { green } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { getName } from '../utils/user'

export const initThanksListener = async client => {
  try {
    // For each message run a function.
    client.on('message', async message => {
      try {
        // If the message isn't a dm, the author isn't a bot, and it contains the word 'thank' or 'kudos', continue.
        if (message.channel.type !== 'dm' && !message.author.bot && ['thank', 'kudos'].some(t => message.content.toLowerCase().includes(t))) {
          // Get the member thanked and filter for undefined members.
          const thankees = message.mentions.members.filter(thankee => thankee !== undefined)

          // If the number of members tagged isn't zero, continue.
          if (thankees.size !== 0) {
            // Save the thanker.
            const thanker = message.member

            // If the thanker is in the list of thankees, send an error message.
            if (thankees.map(thankee => thankee.user.id).includes(thanker.user.id)) {
              return await sendErrorMessage(`You Can't Thank Yourself, ${getName(thanker)}!`, 'You can see how that would be an issue, yes?', message)
            }

            // For each person thanked, increment their thanks counter.
            for (const thankee of thankees) {
              try {
                // Increment the thanks for the user.
                await incrementThanks(thankee[1].user.id, thanker.user.id)
              } catch (err) {
                await logError('Thanks', 'Failed to log the thanks', err)
              }
            }

            // Create array from thankees for easier looping.
            const thankeesArray = thankees.array()

            // Create a string from the list of thankees.
            let thankeesString = ''

            // If there are one, two or more thankees, add them to the string in the proper formatting.
            if (thankeesArray.length === 1) {
              thankeesString = `${thankeesArray[0]} `
            } else if (thankeesArray.length === 2) {
              thankeesString = `${thankeesArray[0]} & ${thankeesArray[1]} `
            } else {
              // Loop through the thankees and depending on what position, add it with the proper separator.
              let iterator = 0
              for (const thankee of thankeesArray) {
                thankeesString += thankeesArray.length === ++iterator
                  ? `& ${thankee}`
                  : `${thankee},`
              }
            }

            try {
              // Send a confirmation message.
              return message.channel.send({
                embed: {
                  title: 'Thanks received!',
                  color: green,
                  description: `${thankeesString} ${thankeesArray.length === 1 ? 'has' : 'have'} been thanked by ${thanker}!`,
                  footer: {
                    text: `Use "thanks @user" to give someone rep, and ".rep @user" to see how much they have!`
                  },
                }
              })
            } catch (err) {
              await logError('Thanks', 'Failed to send message', err)
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
