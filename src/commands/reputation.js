/*
* Gabe Dunn 2018
* Command that sends a number of reputation points for a user.
*/

import { blue } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { getThanks } from '../db'
import { logError } from '../utils/log'
import { getAuthor, getName } from '../utils/user'

// Export an object with command info and the function to execute.
export const reputationCommand = {
  name: 'Reputation',
  aliases: ['reputation', 'reps', 'rep'],
  category: 'utils',
  description: 'Sends a count of reputation points for a user.',
  permissions: ['SEND_MESSAGES'],
  usage: '<user>',
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
      if (member === undefined) {
        return await sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
      }

      // Pull current thanks count from the database.
      const reputation = (await getThanks(member.user.id)).length

      // Create the initial embed.
      const embed = {
        description: `${getName(member)} has ${reputation} reputation.`,
        color: blue,
        author: getAuthor(message.member),
        footer: {
          text: `Use thanks @user to give someone rep!`
        },
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Reputation', 'Failed to delete message', err, message)
      }

      try {
        // Send the embed.
        // noinspection JSCheckFunctionSignatures
        return await message.channel.send({ embed })
      } catch (err) {
        await logError('Reputation', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('Reputation', 'Failed to run command', err, message)
    }
  }
}
