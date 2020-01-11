/*
 * Gabe Dunn 2019
 * File to import all main functions and run them.
 * TODO: go through entire project and user proper naming for user & member
 * TODO: test every case of each command
 * TODO: more extensively check for non-existent instances of classes
 */

import { devmod } from './devmod'
import { log, logError } from './utils/log'

const { botToken, guildID } = require('./utils/config').default

const main = async () => {
  try {
    // If an unhandled rejection occurs log it.
    process.on('unhandledRejection', async err => {
      await logError('Main', 'Unhandled Rejection', err)
    })
    // Same thing but for uncaught exception.
    process.on('uncaughtException', async err => {
      await logError('Main', 'Uncaught Exception', err)
    })
  } catch (err) {
    await logError('Main', 'Failed to add process error listeners', err)
  }

  try {
    if (botToken) {
      if (guildID) {
        await devmod()
      } else {
        log('Main', 'NO GUILD ID!')
      }
    } else {
      log('Main', 'NO BOT TOKEN!')
    }
  } catch (err) {
    await logError('Main', 'Something has failed', err)
  }
}

// Run the main function.
main().then(() => log('Main', 'Bot Initialized!'))
