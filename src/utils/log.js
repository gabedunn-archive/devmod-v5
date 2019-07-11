/*
 * Gabe Dunn 2019
 * Function to make logging look good.
 */

import chalk from 'chalk'

export const log = (area, message) => console.error(`${chalk.greenBright(`[${area}]`)} ${chalk.blue(message)}`)

export const logError = (area, message, err) => console.error(`${chalk.greenBright(`[${area}]`)} ${chalk.redBright(`${message}:`)}`, err)
