/*
 * Gabe Dunn 2019
 * Export a function that expands the commands array into an object with all aliases.
 */

// Given an array of commands, returns an object with all aliases as keys.
import { logError } from './log'

export const expandCommands = commands => {
  try {
    // Return a reduced array.
    return commands.reduce((previous, current) => {
      // Clone previous object.
      const newCommands = previous
      // For each alias in the current command, add a key to the expanded object.
      for (const alias of current.aliases) {
        // If the alias isn't already used, add it to the object.
        if (!newCommands.hasOwnProperty(alias)) {
          newCommands[alias] = current
        }
      }
      return previous
    }, {})
  } catch (err) {
    // noinspection JSIgnoredPromiseFromCall
    logError('Function', 'expandCommand failed', err)
  }
}
