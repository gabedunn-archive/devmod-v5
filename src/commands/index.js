/*
 * Gabe Dunn 2019
 * Object containing all commands and their functions.
 */

import { expandCommands } from '../utils/expandCommands'
import { aboutCommand } from './about'

export const commandsArray = [
  aboutCommand
]

export const commands = expandCommands(commandsArray)
