/*
 * Gabe Dunn 2019
 * Main function for the bot's operation.
 */

import chalk from 'chalk'

import { botToken } from './utils/config'
import discord from "discord.js"
import { initCommandListener } from './processes/commandListener'
import { initActivityChanger } from './processes/activityChanger'
import { initReactionListener } from './processes/roleReactionListener'

export const devmod = async () => {
  try {
    // Initialize the client.
    const client = new discord.Client()

    // Set a listener for the ready event to log that the bot is ready.
    client.on('ready', () => {
      console.log(chalk.blue(`Logged in as ${client.user.tag}.`))
    })

    // Log the bot in.
    try {
      await client.login(botToken)
    } catch (err) {
      console.error('Bot failed to log in:', err)
    }

    // Initialize the command listener.
    initCommandListener(client)
    // Initialize the role reaction listener.
    // await initReactionListener(client)
    // Initialize the activity changer.
    await initActivityChanger(client)

  } catch (err) {
    console.error('Error running bot:', err)
  }
}
