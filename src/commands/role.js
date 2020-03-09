/*
* Gabe Dunn 2018
* Command that adds or removes a role from a user.
*/

import { green, red } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { logError } from '../utils/log'
import { getAuthor } from '../utils/user'

const { approvedRoles } = require('../utils/config').default

// Export an object with command info and the function to execute.
export const roleCommand = {
  name: 'Role',
  aliases: ['role'],
  category: 'utils',
  description: 'Adds or removes a role from a user.',
  permissions: ['SEND_MESSAGES'],
  usage: '<add|rm> <role>',
  exec: async (args, message) => {
    try {
      // If a command isn't specified send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('Command Not Specified', 'You didn\'t specify whether to add or remove a role.', message)
      }

      // Save the command.
      const command = args[0]

      // If a role isn't specified send an error message and terminate the command.
      if (args.length < 2) {
        return await sendErrorMessage('Role Not Specified', 'You didn\'t specify a role to add or remove.', message)
      }

      // Save the role after converting it to lower case.
      const role = args[1].toLowerCase()

      // Reduce the approvedRoles list to an array of all of the keys of each roleGroup.roles.
      const availableRoles = approvedRoles.reduce((previousValue, currentValue) => {
        const previousArray = previousValue
        for (const role of Object.keys(currentValue.roles)) {
          previousArray.push(role)
        }
        return previousArray
      }, [])

      // If the specified role isn't in availableRoles, send an error message and terminate the command.
      if (!availableRoles.some(r => r === role)) {
        return await sendErrorMessage('Invalid Role', 'That role isn\'t allowed or doesn\'t exist.', message)
      }

      // Save the server.
      const guild = message.guild

      // Grab the role from the server.
      const guildRole = guild.roles.cache.find(r => r.name === role)

      // If the role doesn't exist, send an error message and terminate the command.
      if (guildRole === undefined) {
        return await sendErrorMessage('Role Doesn\'t Exist', 'The specified role doesn\'t exist.', message)
      }

      // Save the member.
      const member = message.member

      // Add or remove the role, or reject the command based on the command specified.
      switch (command) {
        case 'add':
          try {
            // Add the role to the member.
            await member.addRole(guildRole)

            try {
              // Delete the user's message.
              await message.delete()
            } catch (err) {
              await logError('Role', 'Failed to delete message', err, message)
            }

            try {
              // Send a confirmation message.
              return message.channel.send({
                embed: {
                  title: 'Role Added',
                  color: green,
                  description: `Added ${guildRole} to ${member}.`,
                  author: getAuthor(member)
                }
              })
            } catch (err) {
              await logError('Role', 'Failed to send message', err, message)
            }
          } catch (err) {
            await logError('Role', 'Failed to add role', err, message)
            return await sendErrorMessage('Couldn\'t Add Role', 'Couldn\'t add the specified role.', message)
          }
          break
        case 'rm':
          try {
            // Remove the role from the member.
            await member.roles.remove(guildRole)

            try {
              // Delete the user's message.
              await message.delete()
            } catch (err) {
              await logError('Role', 'Failed to delete message', err, message)
            }

            try {
              // Send a confirmation message.
              return message.channel.send({
                embed: {
                  title: 'Role Removed',
                  color: red,
                  description: `Removed ${guildRole} from ${member}.`,
                  author: getAuthor(member)
                }
              })
            } catch (err) {
              await logError('Role', 'Failed to send message', err, message)
            }
          } catch (err) {
            await logError('Role', 'Failed to add role', err, message)
            return await sendErrorMessage('Couldn\'t Remove Role', 'Couldn\'t remove the specified role.', message)
          }
          break
        default:
          return await sendErrorMessage('Invalid Command', 'The command wasn\'t one of add or rm.', message)
      }
    } catch (err) {
      await logError('Role', 'Failed to run command', err, message)
    }
  }
}
