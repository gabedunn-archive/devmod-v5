/*
 * Gabe Dunn 2019
 * Function to make logging look good.
 */

import chalk from 'chalk'
import discord from 'discord.js'
import { red } from './colours'
import { capitalize } from './capitalize'
import { sendErrorMessage } from './sendErrorMessage'

const { botToken, channels: { errors } } = require('./config').default

// Given an area and a message, log a nice looking message to the console.
export const log = (area, message) => {
  console.log(`${chalk.greenBright(`[${area}]`)} ${chalk.blue(message)}`)
}

// Given an area, message, and error, log a nice looking error to the console.
export const logError = async (area, message, err, msg = false) => {
  // Log the error to the console.
  console.error(`${chalk.greenBright(`[${area}]`)} ${chalk.redBright(`${message}${err === false ? '' : ':'}`)}`, err === false ? '' : err)

  // Log the error to the error channel.
  logErrorToChannel(area, message, err)

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

const logErrorToChannel = (area, message, err) => {
  try {
    // Create the discord client.
    const client = new discord.Client()

    // Add a listener to run when the client is ready.
    client.on('ready', async () => {
      // Grab the guild object.
      const guild = client.guilds.cache.first()

      // Save the errors channel
      const errorChannel = guild.channels.cache.find(c => c.name === errors)

      if (errorChannel === undefined) {
        return sendErrorMessage('No Error Channel', 'The errors channel either isn\'t set or doesn\'t exist.')
      }

      // Convert the error to an iterable object using a custom replacer function.
      const errorObject = JSON.parse(JSON.stringify(err, errorReplacer))

      // Send the error message.
      await errorChannel.send({
        embed: {
          title: `Error [${area}]:`,
          color: red,
          description: `${message}.`,
          fields: Object.entries(errorObject).map(field => {
            return {
              name: `${capitalize(field[0])}:`,
              value: field[1]
            }
          })
        }
      })

      // Destroy the client after sending the message.
      return client.destroy()
    })

    // Log the bot in.
    return client.login(botToken)
  } catch (err) {
    console.error(`${chalk.greenBright('[Log]')} ${chalk.redBright('Failed to send error message to channel:')}`, err)
  }
}

// Used in JSON.stringify to parse all entries in an error object.
const errorReplacer = (key, value) => {
  // If it's an error, treat it as such.
  if (value instanceof Error) {
    const errorObject = {
      // Pull all enumerable properties, supporting properties on custom Errors
      ...value,
      // Explicitly pull Error's non-enumerable properties
      name: value.name,
      message: value.message
    }
    delete errorObject.stack
    return errorObject
  }
  return value
}
