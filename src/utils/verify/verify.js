/*
 * Gabe Dunn 2019
 * Verification bot.
 */

import { log, logError } from '../log'
import { initInfoReactionListener } from '../../processes/infoReactionListener'
import discord from 'discord.js'

const { botToken } = require('../config')['default']

const main = async () => {
  try {
// If an unhandled rejection occurs, log it and exit the program.
    process.on('unhandledRejection', async err => {
      await logError('Verify', 'Unhandled Rejection', err)
    })
    // Same thing but for uncaught exception.
    process.on('uncaughtException', async err => {
      await logError('Verify', 'Uncaught Exception', err)
    })
  } catch (err) {
    await logError('Verify', 'Failed to add process error listeners', err)
  }

  try {
    // Initialize the client.
    const client = new discord.Client()

    // Set a listener for the ready event to log that the bot is ready.
    client.on('ready', () => {
      log('Init', `Logged in as ${client.user.tag}.`)
    })

    // Log the bot in.
    try {
      await client.login(botToken)
    } catch (err) {
      await logError('Init', 'Bot failed to log in', err)
    }
    await initInfoReactionListener(client)
  } catch (err) {
    await logError('Verify', 'Something has failed', err)
  }
}

// Run the main function.
main().then(() => log('Verify', 'Bot Initialized!'))
