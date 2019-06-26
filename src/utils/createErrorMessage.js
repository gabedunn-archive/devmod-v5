/*
 * Gabe Dunn 2019
 * Export a function to create consistent Discord embedded error messages.
 */

import { red } from './colours'

// Given a title and a description, return the object for a Discord embedded error message.
export const createErrorMessage = (title, description, message) => {
  // React to the message with an X emoji.
  try {
    message.react('❌')
  } catch (err) {
    console.error('Failed to react to message:', err)
  }

  // Send the error message.
  try {
    return message.channel.send({
      embed: {
        title,
        color: red,
        description
      }
    })
  } catch (err) {
    console.error('Failed to send error message:', err)
  }
}
