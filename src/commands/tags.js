/*
* Gabe Dunn 2018
* Command that sends a list of tags.
*/

import { blue, red } from '../utils/colours'
import { msgDeleteTime, prefix } from '../utils/config'
import tags from '../utils/tags'
import { capitalize } from '../utils/capitalize'

// Export an object with command info and the function to execute.
export const tagsCommand = {
  name: 'Tags',
  aliases: ['tags', 'taglist'],
  category: 'utils',
  description: 'Sends a list of tags.',
  permissions: ['SEND_MESSAGES'],
  usage: 'tags',
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
        title: 'Available Tags',
        color: blue,
        author: {
          name: user.username,
          icon_url: user.avatarURL
        },
        fields: [],
        timestamp: new Date()
      }

      // For each tag of tags, add the tag to the embed.
      for (const tag of Object.keys(tags)) {
        // Save the tag name.
        const name = tags[tag].title ? tags[tag].title : capitalize(tag)

        embed.fields.push({
          name,
          value: `\`${prefix}tag ${tag} [<user>]\``
        })
      }

      // If there aren't any roles added, change the colour to red and make the embed say empty.
      if (embed.fields.length <= 0) {
        embed.color = red
        embed.fields = [
          {
            name: 'No Tags',
            value: 'There are currently no tags specified for the bot.'
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
