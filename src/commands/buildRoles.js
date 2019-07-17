/*
* Gabe Dunn 2018
* Command that rebuilds the roles channel messages.
*/

import { blue } from '../utils/colours'
import { channels } from '../utils/config'
import { getSetting, setSetting } from '../db'
import { allRoles } from '../utils/approvedRoles'
import { log, logError } from '../utils/log'
import { getAuthor } from '../utils/user'
import { sendErrorMessage } from '../utils/sendErrorMessage'

// Export an object with command info and the function to execute.
export const buildRolesCommand = {
  name: 'Build Roles',
  aliases: ['buildroles', 'buildRoles', 'build-roles'],
  category: 'admin',
  description: 'Builds the messages in the roles channel.',
  permissions: ['ADMINISTRATOR'],
  exec: async (args, message) => {
    try {
      // Save the previous roles messages.
      const previousRolesMessages = await getSetting('reactions_message_ids')

      // Save the roles channel
      const rolesChannel = message.guild.channels.find(c => c.name === channels.roles)

      if (rolesChannel === undefined) {
        return await sendErrorMessage('No Role Channel', 'The roles channel either isn\'t set or doesn\'t exist.')
      }

      // Find and delete the previous messages.
      // Delete the previous roles messages if they exist.
      for (const messageID of Object.values(previousRolesMessages)) {
        try {
          // noinspection JSCheckFunctionSignatures
          const roleMessage = await rolesChannel.fetchMessage(messageID)
          await roleMessage.delete()
        } catch (err) {
          await logError('BuildRoles', 'Failed to delete roles message', err, message)
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
          const roleMessage = await rolesChannel.send({
            // Create the discord embed to send to the channel.
            embed: {
              title: roleGroup.name,
              color: blue,
              description: `${roleGroup.message}\n\n${roleArray.join('\n')}`
            }
          })

          // Save the message ID.
          messageIDs[roleGroup.id] = roleMessage.id

          // Add each reaction to the roles message.
          for (const reaction of Object.values(roleGroup.roles)) {
            // Wait for the reaction to be added.
            try {
              await roleMessage.react(reaction.emoji)
            } catch (err) {
              await logError('BuildRoles', 'Failed to add reaction to roles message:', err, message)
            }
          }
        } catch (err) {
          await logError('BuildRoles', 'Failed to send message to role channel', err, message)
        }

        // Increment count, and if it's equal to the number of role groups, call the finish function with messageIDs.
        if (++count === allRoles.length) {
          // Log the IDs to the console joined by ', '
          log('BuildRoles', `Role Message IDs: ${Object.values(messageIDs).join(', ')}.`)

          try {
            // Save the messageIDs to the database.
            await setSetting('reactions_message_ids', messageIDs)
            log('BuildRoles', 'Successfully sent roles message!')
          } catch (err) {
            await logError('BuildRoles', 'Error pushing messageIDs to database', err, message)
          }
        }
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('BuildRoles', 'Failed to delete message:', err, message)
      }

      try {
        // Send the confirmation message.
        // noinspection JSCheckFunctionSignatures
        return message.channel.send({
          embed: {
            title: 'Built Roles Message',
            color: blue,
            description: `The roles message has been built and is live in ${rolesChannel}.`,
            author: getAuthor(message.member),
            timestamp: new Date()
          }
        })
      } catch (err) {
        await logError('BuildRoles', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('BuildRoles', 'Failed to run command', err, message)
    }
  }
}
