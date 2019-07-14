/*
 * Gabe Dunn 2019
 * Main file to import all main functions and run them.
 */

import { devmod } from './devmod'
import { logError } from './utils/log'

try {
// If an unhandled rejection occurs, log it and exit the program.
  process.on('unhandledRejection', err => {
    logError('Main', 'Unhandled Rejection', err)
    process.exit(1)
  })
// Same thing but for uncaught exception.
  process.on('uncaughtException', err => {
    logError('Main', 'Uncaught Exception', err)
    process.exit(1)
  })
} catch (err) {
  logError('Main', 'Failed to add process error listeners', err)
}

try {
// noinspection JSIgnoredPromiseFromCall
  devmod()
} catch (err) {
  logError('Main', 'Something has failed', err)
  process.exit(1)
}
