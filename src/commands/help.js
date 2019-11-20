/*
* Gabe Dunn 2018
* Command that sends some information on how to use the bot.
*/

import { blue } from '../utils/colours'
import { commandsArray } from './index'
import { capitalize } from '../utils/capitalize'
import { logError } from '../utils/log'
import { getAuthor } from '../utils/user'

const { msgDeleteTime, prefix } = require('../utils/config')['default']

// Export an object with command info and the function to execute.
export const helpCommand = {
  name: 'Help',
  aliases: ['help', 'commands'],
  category: 'utils',
  description: 'Sends a list of commands that can be used with the bot.',
  permissions: ['SEND_MESSAGES'],
  usage: '[<user> <true>]',
  exec: async (args, message) => {
    try {
      // Set categories to an empty object to have all the commands added into.
      const categories = {}

      // Loop through all commands and add them to their proper place in the categories object.
      for (const command of commandsArray) {
        // Format usage
        const usage = command.usage ? `${command.aliases[0]} ${command.usage}` : command.aliases[0]
        // Save the embed field.
        const field = {
          name: command.name,
          value: `Usage: \`${prefix}${usage}\`\n${command.description}`
        }

        try {
          // If the user has the permissions to run the command, add it to the array.
          if (await message.member.hasPermission(command.permissions)) {
            // If the category exists, push the field. Otherwise, initialize the category with the field as it's first element.
            if (categories.hasOwnProperty(command.category)) {
              categories[command.category].push(field)
            } else {
              categories[command.category] = [field]
            }
          }
        } catch (err) {
          await logError('Help', 'Failed to test for user permissions', err, message)
        }
      }

      try {
        // If a member is tagged, tag them.
        if (message.mentions.members.array().length > 0) {
          // Save the user object of the member
          const taggedUserID = message.mentions.members.first().id

          // If the user exists, send a message tagging them.
          if (taggedUserID !== undefined) {
            // Sent the message tagging the user.
            const sent = await message.channel.send(`<@${taggedUserID}>`)

            // If msgDeleteTime doesn't equal 0, set a timeout to delete the message after x seconds. (x secs * 1000 ms).
            if (msgDeleteTime !== 0 && !args.includes('true')) {
              setTimeout(() => {
                // Delete the message.
                sent.delete(1)
              }, msgDeleteTime * 1000)
            }
          }
        }
      } catch (err) {
        await logError('Help', 'Failed to tag user', err, message)
      }

      // For each category, send a message with each of the commands.
      for (const category of Object.keys(categories)) {
        try {
          // Send the message.
          // noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
          const sent = await message.channel.send({
            embed: {
              title: capitalize(category),
              color: blue,
              fields: categories[category],
              author: getAuthor(message.member)
            }
          })

          // If msgDeleteTime doesn't equal 0, set a timeout to delete the message after x seconds. (x secs * 1000 ms).
          if (msgDeleteTime !== 0 && !args.includes('true')) {
            setTimeout(async () => {
              try {
                // Delete the message.
                sent.delete(1)
              } catch (err) {
                await logError('Tags', 'Failed to delete message', err, message)
              }
            }, msgDeleteTime * 1000)
          } else {
            return sent
          }
        } catch (err) {
          await logError('Help', 'Failed to send message', err, message)
        }
      }
      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Help', 'Failed to delete message', err, message)
      }
    } catch (err) {
      await logError('Help', 'Failed to run command', err, message)
    }
  }
}
