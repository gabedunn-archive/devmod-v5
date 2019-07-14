/*
 * Gabe Dunn 2019
 * Function to make logging look good.
 */

import chalk from 'chalk'

// Given an area and a message, log a nice looking message to the console.
export const log = (area, message) => {
  console.log(`${chalk.greenBright(`[${area}]`)} ${chalk.blue(message)}`)
}

// Given an area, message, and error, log a nice looking error to the console.
export const logError = (area, message, err, msg = false) => {
  console.error(`${chalk.greenBright(`[${area}]`)} ${chalk.redBright(`${message}:`)}`, err)
  if (msg) {
    try {
      message.react('❌')
    } catch (err) {
      console.error(`${chalk.greenBright('[Log]')} ${chalk.redBright('Failed to add failure reaction:')}`, err)
    }
  }
}
