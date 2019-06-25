/*
 * Gabe Dunn 2019
 * Main file to import all main functions and run them.
 */

import { devmod } from './devmod'
import { sendRolesMessage } from './processes/sendRolesMessage'

// If an unhandled rejection occurs, log it and exit the program.
process.on('unhandledRejection', (err, p) => {
  console.error('Unhandled Rejection:', err.stack, p)
  process.exit(1)
})
// Same thing but for uncaught exception.
process.on('uncaughtException', (err, p) => {
  console.error('Uncaught Exception:', err.stack, p)
  process.exit(1)
})

// If '--roles' is provided as an argument from the command line, send the roles message(s). Otherwise run the bot.
if (process.argv.indexOf('--roles') !== -1) {
  // noinspection JSIgnoredPromiseFromCall
  sendRolesMessage()
} else {
  devmod()
}
