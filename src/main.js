/*
 * Gabe Dunn 2019
 * Main file to import all main functions and run them.
 */

import { devmod } from './devmod'
import { sendRolesMessage } from './processes/sendRolesMessage'

// If '--roles' is provided as an argument from the command line, send the roles message(s). Otherwise run the bot.
if (process.argv.indexOf('--roles') !== -1) {
  sendRolesMessage()
} else {
  devmod()
}
