/*
 * Gabe Dunn 2019
 * Object containing all commands and their functions.
 */

import { expandCommands } from '../utils/expandCommands'

import { aboutCommand } from './about'
import { banCommand } from './ban'
import { buildInfoCommand } from './buildInfo'
import { buildRolesCommand } from './buildRoles'
import { clearWarnsCommand } from './clearWarns'
import { helpCommand } from './help'
import { killCommand } from './kill'
import { lmgtfyCommand } from './lmgtfy'
import { lockCommand } from './lock'
import { mdnCommand } from './mdn'
import { moveCommand } from './move'
import { muteCommand } from './mute'
import { pingCommand } from './ping'
import { pruneCommand } from './prune'
import { reportCommand } from './report'
import { reputationCommand } from './reputation'
import { roleCommand } from './role'
import { rolesCommand } from './roles'
import { statsCommand } from './stats'
import { tagCommand } from './tag'
import { tagsCommand } from './tags'
import { unbanCommand } from './unban'
import { unlockCommand } from './unlock'
import { unmuteCommand } from './unmute'
import { usersCommand } from './users'
import { warnCommand } from './warn'
import { warnsCommand } from './warns'
import { yeetCommand } from './yeet'

// Export an array with all of the commands.
export const commandsArray = [
  aboutCommand,
  banCommand,
  buildInfoCommand,
  buildRolesCommand,
  clearWarnsCommand,
  helpCommand,
  killCommand,
  lmgtfyCommand,
  lockCommand,
  mdnCommand,
  moveCommand,
  muteCommand,
  pingCommand,
  pruneCommand,
  reportCommand,
  reputationCommand,
  roleCommand,
  rolesCommand,
  statsCommand,
  tagCommand,
  tagsCommand,
  unbanCommand,
  unlockCommand,
  unmuteCommand,
  usersCommand,
  warnCommand,
  warnsCommand,
  yeetCommand
]

// Export an array with all of the commands' aliases as keys.
export const commands = expandCommands(commandsArray)
