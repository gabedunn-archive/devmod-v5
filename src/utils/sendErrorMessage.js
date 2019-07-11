/*
 * Gabe Dunn 2019
 * Export a function to create consistent Discord embedded error messages.
 */

import { red } from './colours'
import { logError } from './log'

// Given a title and a description, return the object for a Discord embedded error message.
export const sendErrorMessage = (title, description, message) => {
  try {
    // React to the message with an X emoji.
    message.react('❌')
  } catch (err) {
    logError('Function', 'Failed to react to message', err)
  }

  try {
    // Send the error message.
    // noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
    return message.channel.send({
      embed: {
        title,
        color: red,
        description
      }
    })
  } catch (err) {
    logError('Function', 'Failed to send error message', err)
  }
}
