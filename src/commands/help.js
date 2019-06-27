/*
* Gabe Dunn 2018
* Command that sends some information on how to use the bot.
*/

import { blue } from '../utils/colours'
import { commandsArray } from './index'
import { msgDeleteTime, prefix } from '../utils/config'
import { capitalize } from '../utils/capitalize'

// Export an object with command info and the function to execute.
export const helpCommand = {
  name: 'Help',
  aliases: ['help', 'commands'],
  category: 'utils',
  description: 'Sends a list of commands that can be used with the bot.',
  permissions: ['SEND_MESSAGES'],
  usage: 'help [<user>]',
  exec: async (args, message) => {
    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Set categories to an empty object to have all the commands added into.
    const categories = {}

    // Loop through all commands and add them to their proper place in the categories object.
    for (const command of commandsArray) {
      // Save the embed field.
      const field = {
        name: command.name,
        value: `Usage: ${prefix}${command.usage || command.aliases[0]}\n${command.description}`
      }

      // If the category exists, push the field. Otherwise, initialize the category with the field as it's first element.
      if (categories.hasOwnProperty(command.category)) {
        categories[command.category].push(field)
      } else {
        categories[command.category] = [field]
      }
    }

    // Get the member tagged in the args.
    const member = message.member

    // Save the user object of the member
    const user = member.user

    // Save the member's nickname if they have one, otherwise save name.
    const name = member.nickname ? member.nickname : user.username

    // If a member is tagged, tag them.
    if (args.length > 0) {
      // Save the user object of the member
      const taggedUserID = message.mentions.members.first().id

      // If the user exists, send a message tagging them.
      if (taggedUserID !== null && taggedUserID !== undefined) {
        // Sent the message tagging the user.
        const sent = await message.channel.send(`<@${taggedUserID}>`)

        // If msgDeleteTime doesn't equal 0, set a timeout to delete the message after x seconds. (x secs * 1000 ms).
        if (msgDeleteTime !== 0) {
          setTimeout(() => {
            // Delete the message.
            sent.delete(1)
          }, msgDeleteTime * 1000)
        }

      }
    }

    // For each category, send a message with each of the commands.
    for (const category of Object.keys(categories)) {
      // Send the message.
      // noinspection JSUnresolvedFunction
      const sent = await message.channel.send({
        embed: {
          title: capitalize(category),
          color: blue,
          fields: categories[category],
          author: {
            name: `${name} (${user.tag})`,
            icon_url: user.avatarURL
          }
        }
      })

      // If msgDeleteTime doesn't equal 0, set a timeout to delete the message after x seconds. (x secs * 1000 ms).
      if (msgDeleteTime !== 0) {
        setTimeout(() => {
          // Delete the message.
          sent.delete(1)
        }, msgDeleteTime * 1000)
      }
    }
  }
}
