/*
 * Gabe Dunn 2019
 * Main file to import all main functions and run them.
 */

import { devmod } from './devmod'

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

// noinspection JSIgnoredPromiseFromCall
devmod()
