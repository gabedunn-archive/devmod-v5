/*
 * Gabe Dunn 2019
 * Main file to import all main functions and run them.
 * TODO: go through entire project and user proper naming for user & member
 * TODO: test every case of each command
 * TODO: more extensively check for non-existent instances of classes
 * TODO: add universal logging error generators
 */

import { devmod } from './devmod'
import { log, logError } from './utils/log'

const main = async () => {
  try {
// If an unhandled rejection occurs, log it and exit the program.
    process.on('unhandledRejection', async err => {
      await logError('Main', 'Unhandled Rejection', err)
      process.exit(1)
    })
    // Same thing but for uncaught exception.
    process.on('uncaughtException', async err => {
      await logError('Main', 'Uncaught Exception', err)
      process.exit(1)
    })
  } catch (err) {
    await logError('Main', 'Failed to add process error listeners', err)
  }

  try {
    await devmod()
  } catch (err) {
    await logError('Main', 'Something has failed', err)
  }
}

// Run the main function.
main().then(r => log('Main', 'Bot Initialized', r))
