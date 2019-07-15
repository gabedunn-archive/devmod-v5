/*
* Gabe Dunn 2018
* Command that sends a number of reputation points for a user.
*/

import { blue } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { getThanks } from '../db'
import { logError } from '../utils/log'

// Export an object with command info and the function to execute.
export const reputationCommand = {
  name: 'Reputation',
  aliases: ['reputation', 'reps', 'rep'],
  category: 'utils',
  description: 'Sends a count of reputation points for a user.',
  permissions: ['SEND_MESSAGES'],
  usage: 'reputation <user>',
  exec: async (args, message) => {
    try {
      // If a user isn't specified send an error message and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('User Not Specified', 'You didn\'t specify a user to show reputation for.', message)
      }

      // Save the user object of the member to show reputation for..
      // noinspection DuplicatedCode
      const member = message.mentions.members.first()

      // If the user doesn't exist send an error message and terminate the command.
      if (member === null) {
        return await sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
      }

      // Save the user's nickname.
      const name = member.nickname ? member.nickname : member.user.username

      // Save the user who sent the message. 'member.user' if 'member' exists, otherwise 'author'.
      const user = message.member ? message.member.user : message.author

      // Pull current thanks count from the database.
      const reputation = (await getThanks(member.user.id)).length

      // Create the initial embed.
      const embed = {
        title: `Reputation for ${name} (${member.user.tag})`,
        color: blue,
        description: `${member} has ${reputation} reputation.`,
        author: {
          name: user.username,
          icon_url: user.avatarURL
        },
        footer: {
          icon_url: member.user.avatarURL,
          text: `${name}'s (${member.user.tag}'s) reputation.`
        },
        timestamp: new Date()
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        logError('Reputation', 'Failed to delete message', err, message)
      }

      try {
        // Send the embed.
        // noinspection JSCheckFunctionSignatures
        return await message.channel.send({ embed })
      } catch (err) {
        logError('Reputation', 'Failed to send message', err, message)
      }
    } catch (err) {
      logError('Reputation', 'Failed to run command', err, message)
    }
  }
}
