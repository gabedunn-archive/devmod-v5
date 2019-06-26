/*
 * Gabe Dunn 2019
 * Object containing all commands and their functions.
 */

import { expandCommands } from '../utils/expandCommands'

import { aboutCommand } from './about'
import { pruneCommand} from './prune'

export const commandsArray = [
  aboutCommand,
  pruneCommand
]

export const commands = expandCommands(commandsArray)
