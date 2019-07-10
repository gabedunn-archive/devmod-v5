/*
* Gabe Dunn 2018
* Command that adds or removes a role from a user.
*/

import { green, red } from '../utils/colours'
import { allRoles } from '../utils/approvedRoles'
import { sendErrorMessage } from '../utils/sendErrorMessage'

// Export an object with command info and the function to execute.
export const roleCommand = {
  name: 'Role',
  aliases: ['role'],
  category: 'utils',
  description: 'Adds or removes a role from a user.',
  permissions: ['SEND_MESSAGES'],
  usage: 'role <add|rm> <role>',
  exec: async (args, message) => {
    // If a command isn't specified send an error message and terminate the command.
    if (args.length < 1) {
      await message.react('❌')
      return sendErrorMessage('Command Not Specified', 'You didn\'t specify whether to add or remove a role.', message)
    }

    // Save the command.
    const command = args[0]

    // If a role isn't specified send an error message and terminate the command.
    if (args.length < 2) {
      await message.react('❌')
      return sendErrorMessage('Role Not Specified', 'You didn\'t specify a role to add or remove.', message)
    }

    // Save the role after converting it to lower case.
    const role = args[1].toLowerCase()

    // Reduce the allRoles list to an array of all of the keys of each roleGroup.roles.
    const availableRoles = allRoles.reduce((previousValue, currentValue) => {
      const previousArray = previousValue
      for (const role of Object.keys(currentValue.roles)) {
        previousArray.push(role)
      }
      return previousArray
    }, [])

    // If the specified role isn't in availableRoles, send an error message and terminate the command.
    if (!availableRoles.some(r => r === role)) {
      await message.react('❌')
      return sendErrorMessage('Invalid Role', 'That role isn\'t allow or doesn\'t exist.', message)
    }

    // Save the server.
    const guild = message.guild

    // Grab the role from the server.
    const guildRole = guild.roles.find(r => r.name === role)

    // If the role doesn't exist, send an error message and terminate the command.
    if (guildRole === null) {
      await message.react('❌')
      return sendErrorMessage('Role Doesn\'t Exist', 'The specified role doesn\'t exist.', message)
    }

    // Save the member.
    const member = message.member

    // Add or remove the role, or reject the command based on the command specified.
    switch (command) {
      case 'add':
        try {
          // Add the role to the member.
          await member.addRole(guildRole)

          // Delete the user's message.
          await message.delete()

          // Send a confirmation message.
          return message.channel.send({
            embed: {
              title: 'Role Added',
              color: green,
              description: `Added ${role} to ${member.user.tag}`,
              author: {
                name: member.user.username,
                icon_url: member.user.avatarURL
              }
            }
          })
        } catch (e) {
          await message.react('❌')
          return sendErrorMessage('Couldn\'t Add Role', 'Couldn\'t add the specified role.', message)
        }
      case 'rm':
        try {
          // Remove the role from the member.
          await member.removeRole(guildRole)

          // Delete the user's message.
          await message.delete()

          // Send a confirmation message.
          return message.channel.send({
            embed: {
              title: 'Role Removed',
              color: red,
              description: `Removed ${role} from ${member.user.tag}`,
              author: {
                name: member.user.username,
                icon_url: member.user.avatarURL
              }
            }
          })
        } catch (e) {
          await message.react('❌')
          return sendErrorMessage('Couldn\'t Remove Role', 'Couldn\'t remove the specified role.', message)
        }
      default:
        await message.react('❌')
        return sendErrorMessage('Invalid Command', 'The command wasn\'t one of add or rm.', message)
    }
  }
}
