/*
 * Gabe Dunn 2019
 * Function to make logging look good.
 */

import chalk from 'chalk'
import discord from 'discord.js'
import { botOwner, botToken } from './config'
import { red } from './colours'
import { capitalize } from './capitalize'

// Given an area and a message, log a nice looking message to the console.
export const log = (area, message) => {
  console.log(`${chalk.greenBright(`[${area}]`)} ${chalk.blue(message)}`)
}

// Given an area, message, and error, log a nice looking error to the console.
export const logError = async (area, message, err, msg = false) => {
  // Log the error to the console.
  console.error(`${chalk.greenBright(`[${area}]`)} ${chalk.redBright(`${message}:`)}`, err)

  // Log the error to the bot owner's DMs.
  logErrorToDM(area, message, err)

  // If a msg was passed, try to add the failed reaction.
  if (msg) {
    try {
      // If the message wasn't deleted, add the reaction.
      // noinspection JSUnresolvedVariable
      if (!msg.deleted) {
        await msg.react('❌')
      }
    } catch (err) {
      console.error(`${chalk.greenBright('[Log]')} ${chalk.redBright('Failed to add failure reaction:')}`, err)
    }
  }
}

const logErrorToDM = (area, message, err) => {
  try {
    // Create the discord client.
    const client = new discord.Client()

    // Add a listener to run when the client is ready.
    client.on('ready', async () => {
      // Save the owner of the bot.
      const owner = client.users.find(u => u.id === botOwner)

      // If the owner exists, send a DM.
      if (owner !== undefined) {
        // Create a DM channel with the owner.
        const dm = await owner.createDM()

        // Send the owner a DM.
        await dm.send({
          embed: {
            title: `Error [${area}]:`,
            color: red,
            description: message,
            fields: Object.entries(err).map(field => {
              return {
                name: `${capitalize(field[0])}:`,
                value: field[1]
              }
            })
          }
        })

        // Destroy the client after sending the message.
        return client.destroy()
      }
    })

    // Log the bot in.
    return client.login(botToken)
  } catch (err) {
    console.error(`${chalk.greenBright('[Log]')} ${chalk.redBright('Failed to send owner DM:')}`, err)
  }
}
