/*
 * Gabe Dunn 2019
 * Main function for the bot's operation.
 */

import discord from 'discord.js'

import { botToken } from './utils/config'
import { log, logError } from './utils/log'
import { initCommandListener } from './processes/commandListener'
import { initActivityChanger } from './processes/activityChanger'
import { initReactionListener } from './processes/roleReactionListener'
import { initInfoReactionListener } from './processes/infoReactionListener'
import { initTorielsAntiBotCrusade } from './processes/torielsAntiBotCrusade'

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
    logError('Init', 'Bot failed to log in', err)
  }

  // Save all the processes to an array.
  const processes = [
    initCommandListener,
    initReactionListener,
    initInfoReactionListener,
    initActivityChanger,
    initTorielsAntiBotCrusade
  ]

  // For each process, run it asynchronously.
  for (const process of processes) {
    try {
      process(client)
    } catch (err) {
      logError('Init', `Failed to initialize process ${process.name}`, err)
    }
  }
}
