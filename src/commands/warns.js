/*
* Gabe Dunn 2018
* Command that sends a list of warnings for a user.
*/

import { green, orange, red, yellow } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { getWarnings } from '../db'
import { autoBanWarns } from '../utils/config'
import { logError } from '../utils/log'
import { getAuthor, getName } from '../utils/user'

// Export an object with command info and the function to execute.
export const warnsCommand = {
  name: 'Warns',
  aliases: ['warns', 'warnlist'],
  category: 'moderation',
  description: 'Sends a list of warnings for a user.',
  permissions: ['KICK_MEMBERS'],
  usage: '<user>',
  exec: async (args, message) => {
    try {
      // If a user isn't specified send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('User Not Specified', 'You didn\'t specify a user to list the warnings for.', message)
      }

      // Save the user object of the member to be warned.
      // noinspection DuplicatedCode
      const member = message.mentions.members.first()

      // If the user doesn't exist send an error message and terminate the command.
      if (member === undefined) {
        return await sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
      }

      // Pull current warnings from the database.
      const currentWarnings = await getWarnings(member.user.id)

      // Select the colour based on the number of previous warnings.
      const colour = currentWarnings.length === 1
        ? yellow
        : currentWarnings.length < autoBanWarns
          ? orange
          : red

      // Create the initial embed.
      const embed = {
        title: `Warnings for ${getName(member)} (${member.user.tag})`,
        color: colour,
        author: getAuthor(member),
        fields: [],
        footer: {
          icon_url: member.user.avatarURL,
          text: `${getName(member)}'s (${member.user.tag}'s) warnings.`
        },
        timestamp: new Date()
      }

      // Start the warning counter.
      let count = 0

      // For each tag of tags, add the tag to the embed.
      for (const warning of currentWarnings) {
        // Push a field to the embed for each warning.
        embed.fields.push({
          name: `Warning #${++count}`,
          value: `Reason: ${warning.reason}.`
        })
      }

      // If there aren't any warnings added, change the colour to red and make the embed say empty.
      if (embed.fields.length <= 0) {
        embed.color = green
        embed.fields = [
          {
            name: 'No Warnings',
            value: 'The specified member doesn\'t have any warnings.'
          }
        ]
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Warns', 'Failed to delete message', err, message)
      }

      try {
        // Send the embed.
        // noinspection JSCheckFunctionSignatures
        return await message.channel.send({ embed })
      } catch (err) {
        await logError('Warns', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('Warns', 'Failed to run command', err, message)
    }
  }
}
