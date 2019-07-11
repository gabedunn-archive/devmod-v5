/*
* Gabe Dunn 2018
* Command that rebuilds the roles channel messages.
*/

import { blue } from '../utils/colours'
import { sendRolesMessage } from '../utils/sendRolesMessage'
import { channels } from '../utils/config'

// Export an object with command info and the function to execute.
export const rebuildRolesCommand = {
  name: 'Rebuild Roles',
  aliases: ['rebuildRoles', 'rebuild-roles'],
  category: 'admin',
  description: 'Rebuilds the messages in the roles channel.',
  permissions: ['ADMINISTRATOR'],
  usage: 'rebuild-roles',
  exec: async (args, message) => {
    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Save the user who sent the message. 'member.user' if 'member' exists, otherwise 'author'.
    const user = message.member ? message.member.user : message.author

    // Call the send roles message function.
    await sendRolesMessage()

    // Save the current server.
    const guild = message.guild

    // Save the roles channel ID
    const rolesChannel = guild.channels.find(c => c.name === channels.roles).id

    try {
      // Send the confirmation message.
      // noinspection JSCheckFunctionSignatures
      return message.channel.send({
        embed: {
          title: 'Rebuilt Roles Message',
          color: blue,
          description: `The roles message has been rebuilt and is live in <#${rolesChannel}>.`,
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
