/*
 * Gabe Dunn 2019
 * Object containing all commands and their functions.
 */

// TODO: clearWarns, gbp, report, role, roles, tag, unban, warn, warnList

import { expandCommands } from '../utils/expandCommands'

import { aboutCommand } from './about'
import { banCommand } from './ban'
import { helpCommand } from './help'
import { lmgtfyCommand } from './lmgtfy'
import { muteCommand } from './mute'
import { pingCommand } from './ping'
import { pruneCommand } from './prune'
import { rebuildRolesCommand } from './rebuildRoles'
import { statsCommand } from './stats'
import { unmuteCommand } from './unmute'
import { usersCommand } from './users'

// Export an array with all of the commands.
export const commandsArray = [
  aboutCommand,
  banCommand,
  helpCommand,
  lmgtfyCommand,
  muteCommand,
  pingCommand,
  pruneCommand,
  rebuildRolesCommand,
  statsCommand,
  unmuteCommand,
  usersCommand
]

// Export an array with all of the commands' aliases as keys.
export const commands = expandCommands(commandsArray)
