/*
 * Gabe Dunn 2019
 * Object containing all commands and their functions.
 */

// TODO: clearWarns, gbp, prune, report, role, roles, stats, tag, unban, unmute, users, warn, warnList

import { expandCommands } from '../utils/expandCommands'

import { aboutCommand } from './about'
import { banCommand } from './ban'
import { helpCommand } from './help'
import { lmgtfyCommand } from './lmgtfy'
import { muteCommand } from './mute'
import { pingCommand } from './ping'
import { pruneCommand } from './prune'

// Export an array with all of the commands.
export const commandsArray = [
  aboutCommand,
  banCommand,
  helpCommand,
  lmgtfyCommand,
  muteCommand,
  pingCommand,
  pruneCommand
]

// Export an array with all of the commands' aliases as keys.
export const commands = expandCommands(commandsArray)
