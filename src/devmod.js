/*
 * Gabe Dunn 2019
 * Main function for the bot's operation.
 */

import chalk from 'chalk'

import { botToken } from './utils/config'
import discord from "discord.js"
import { commandListenerInit } from './utils/commandListener'

export const devmod = async () => {
  try {
    // Initialize the client.
    const client = new discord.Client()

    // Set a listener for the ready event to log that the bot is ready.
    client.on('ready', () => {
      console.log(chalk.blue(`Logged in as ${client.user.tag}.`))
    })

    commandListenerInit(client)

    try {
      await client.login(botToken)
    } catch (err) {
      console.error('Bot failed to log in:', err)
    }
  } catch (err) {
    console.error('Error running bot:', err)
  }
}
