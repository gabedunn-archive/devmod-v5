/*
* Gabe Dunn 2018
* Command that rebuilds the roles channel messages.
*/

import chalk from 'chalk'

import { blue } from '../utils/colours'
import { channels } from '../utils/config'
import { getSetting, setSetting } from '../db'
import { allRoles } from '../utils/approvedRoles'

// Export an object with command info and the function to execute.
export const buildRolesCommand = {
  name: 'Build Roles',
  aliases: ['buildRoles', 'build-roles', 'buildroles'],
  category: 'admin',
  description: 'Builds the messages in the roles channel.',
  permissions: ['ADMINISTRATOR'],
  usage: 'buildRoles',
  exec: async (args, message) => {
    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Save the user who sent the message. 'member.user' if 'member' exists, otherwise 'author'.
    const user = message.member ? message.member.user : message.author

    // Save the previous roles messages.
    const previousRolesMessages = await getSetting('reactions_message_ids')

    // Save the roles channel
    const rolesChannel = message.guild.channels.find(c => c.name === channels.roles)

    // If the roles channel exists, find and delete the previous messages.
    if (rolesChannel !== null) {
      // Delete the previous roles messages if they exist.
      for (const messageID of Object.values(previousRolesMessages)) {
        const message = await rolesChannel.fetchMessage(messageID)
        await message.delete()
      }
    }

    // Initialize empty variables.
    const messageIDs = {}
    let count = 0

    // For each group of roles in allRoles, send a message.
    for (const roleGroup of allRoles) {
      // Create an array, and for each approved role push a string with 'name: emoji' to it.
      const roleArray = []
      for (const role of Object.values(roleGroup.roles)) {
        roleArray.push(`${role.name}: ${role.emoji}`)
      }

      try {
        // Find the roles channel, send the roles message, and save the ID.
        // noinspection JSObjectNullOrUndefined
        const message = await rolesChannel.send({
          // Create the discord embed to send to the channel.
          embed: {
            title: roleGroup.name,
            color: blue,
            description: `${roleGroup.message}\n\n${roleArray.join('\n')}`
          }
        })

        // Save the message ID.
        messageIDs[roleGroup.id] = message.id

        // Add each reaction to the roles message.
        for (const reaction of Object.values(roleGroup.roles)) {
          // Wait for the reaction to be added.
          try {
            await message.react(reaction.emoji)
          } catch (err) {
            console.error('Failed to add reaction to roles message:', err)
          }
        }
      } catch (err) {
        console.error('Failed to send message to role channel:', err)
      }

      // Increment count, and if it's equal to the number of role groups, call the finish function with messageIDs.
      if (++count === allRoles.length) {
        // Log the IDs to the console joined by ', '
        console.log(chalk.blue(`Role Message IDs: ${Object.values(messageIDs).join(', ')}.`))

        try {
          // Save the messageIDs to the database.
          await setSetting('reactions_message_ids', messageIDs)
          console.log(chalk.greenBright('Successfully sent roles message!'))
        } catch (err) {
          console.error('Error pushing messageIDs to database:', err)
        }
      }
    }

    try {
      // Send the confirmation message.
      // noinspection JSCheckFunctionSignatures
      return message.channel.send({
        embed: {
          title: 'Rebuilt Roles Message',
          color: blue,
          description: `The roles message has been rebuilt and is live in <#${rolesChannel.id}>.`,
          author: {
            name: user.username,
            icon_url: user.avatarURL
          },
          timestamp: new Date()
        }
      })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }
}
