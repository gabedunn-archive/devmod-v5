/*
 * Gabe Dunn 2019
 * Main function to initialize the bot's operation.
 */

import discord from 'discord.js'

import { log, logError } from './utils/log'
import { initCommandListener } from './processes/commandListener'
import { initActivityChanger } from './processes/activityChanger'
import { initReactionListener } from './processes/roleReactionListener'
import { initTorielsAntiBotCrusade } from './processes/torielsAntiBotCrusade'
import { initThanksListener } from './processes/thanksListener'
import { testChannelsAndRoles } from './utils/testChannelsAndRoles'

const { botToken } = require('./utils/config').default

export const devmod = async () => {
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

  // Test that all the channels and roles specified in the config exist.
  // noinspection ES6MissingAwait
  testChannelsAndRoles(client)

  // Save all the processes to an array.
  const processes = [
    initCommandListener,
    initReactionListener,
    initActivityChanger,
    initTorielsAntiBotCrusade,
    initThanksListener
  ]

  // For each process, run it asynchronously.
  for (const process of processes) {
    try {
      // noinspection ES6MissingAwait
      process(client)
    } catch (err) {
      await logError('Init', `Failed to initialize process ${process.name}`, err)
    }
  }
}
