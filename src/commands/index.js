/*
 * Gabe Dunn 2019
 * Object containing all commands and their functions.
 */

import { expandCommands } from '../utils/expandCommands'

import { aboutCommand } from './about'
import { banCommand } from './ban'
import { pruneCommand } from './prune'

// Export an array with all of the commands.
export const commandsArray = [
  aboutCommand,
  banCommand,
  pruneCommand
]

// Export an array with all of the commands' aliases as keys.
export const commands = expandCommands(commandsArray)
