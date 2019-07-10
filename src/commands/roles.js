/*
* Gabe Dunn 2018
* Command that sends a list of roles.
*/

import { blue, red } from '../utils/colours'
import { msgDeleteTime, prefix } from '../utils/config'
import { allRoles } from '../utils/approvedRoles'

// Export an object with command info and the function to execute.
export const rolesCommand = {
  name: 'Roles',
  aliases: ['roles', 'rolelist'],
  category: 'utils',
  description: 'Sends a list of roles.',
  permissions: ['SEND_MESSAGES'],
  usage: 'roles',
  exec: async (args, message) => {
    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Save the user who sent the message. 'member.user' if 'member' exists, otherwise 'author'.
    const user = message.member ? message.member.user : message.author

    try {
      // Create the initial embed.
      const embed = {
        title: 'Available Roles',
        color: blue,
        author: {
          name: user.username,
          icon_url: user.avatarURL
        },
        fields: [],
        timestamp: new Date()
      }

      // For each roleGroup of allRoles, loop through the roleGroup and add each role to the embed.
      for (const roleGroup of allRoles) {
        // For each role in the roleGroup's roles property, push an entry to the embed with it's information.
        for (const role of Object.keys(roleGroup.roles)) {
          embed.fields.push({
            name: `${roleGroup.roles[role].name} | ${roleGroup.roles[role].emoji}`,
            value: `\`${prefix}role add ${role}\` | \`${prefix}role rm ${role}\``
          })
        }
      }

      // If there aren't any roles added, change the colour to red and make the embed say empty.
      if (embed.fields.length <= 0) {
        embed.color = red
        embed.fields = [
          {
            name: 'No (Approved) Roles',
            value: 'There are currently either no approved roles or no roles' +
              ' at all on this server.'
          }
        ]
      }

      // Save the message to a variable for later deletion.
      // noinspection JSCheckFunctionSignatures
      const sent = await message.channel.send({ embed })

      // Return a timeout that deletes the message after x seconds (x seconds * 1000 ms where x = msgDeleteTime).
      return setTimeout(() => {
        // Delete the message.
        sent.delete(1)
      }, msgDeleteTime * 1000)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }
}
