/*
* Gabe Dunn 2018
* Command that sends a specified tag.
*/

import { sendErrorMessage } from '../utils/sendErrorMessage'
import tags from '../utils/tags'
import { logError } from '../utils/log'

// Export an object with command info and the function to execute.
export const tagCommand = {
  name: 'Tag',
  aliases: ['tag', 't'],
  category: 'utils',
  description: 'Sends a specified tag.',
  permissions: ['SEND_MESSAGES'],
  usage: 'tag <tag> [<user]',
  exec: async (args, message) => {
    try {
      // If a tag isn't specified send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('Command Not Specified', 'You didn\'t specify whether to add or remove a role.', message)
      }

      // Save the tag.
      const tag = args[0]

      // If a member is specified, save it. Otherwise return undefined.
      const taggedMember = message.mentions.members.first()

      // If the tag doesn't exist, send an error message and terminate the command.
      if (!tags.hasOwnProperty(tag)) {
        return await sendErrorMessage('Tag Not Found', 'No tag with that name exists.', message)
      }

      // Save the embed from the tags.
      const embed = tags[tag]

      // Save the user.
      const user = message.member ? message.member.user : message.author

      // Add the author & timestamp to the embed.
      embed.author = {
        name: user.username,
        icon_url: user.avatarURL
      }
      embed.timestamp = new Date()

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        logError('Tag', 'Failed to delete message', err, message)
      }

      try {
        // noinspection JSUnresolvedFunction
        return message.channel.send(taggedMember, { embed })
      } catch (err) {
        logError('Tag', 'Failed to send message', err, message)
      }
    } catch (err) {
      logError('Tag', 'Failed to run command', err, message)
    }
  }
}
