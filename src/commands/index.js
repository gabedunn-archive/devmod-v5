/*
 * Gabe Dunn 2019
 * Object containing all commands and their functions.
 */

// TODO: clearWarns, gbp, lmgtfy, mute, ping, prune, report, role, roles, stats, tag, unban, unmute, users, warn, warnList

import { expandCommands } from '../utils/expandCommands'

import { aboutCommand } from './about'
import { banCommand } from './ban'
import { helpCommand } from './help'
import { pruneCommand } from './prune'

// Export an array with all of the commands.
export const commandsArray = [
  aboutCommand,
  banCommand,
  helpCommand,
  pruneCommand
]

// Export an array with all of the commands' aliases as keys.
export const commands = expandCommands(commandsArray)
