/*
* Gabe Dunn 2018
* Command that sends the number of reputation points for either a user or the top users.
*/

import { blue } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { getThanks, getTopThanks } from '../db'
import { logError } from '../utils/log'
import { getAuthor, getName } from '../utils/user'

const { repCoin } = require('../utils/config').default

// Export an object with command info and the function to execute.
export const reputationCommand = {
  name: 'Reputation',
  aliases: ['reputation', 'reps', 'rep'],
  category: 'utils',
  description: 'Sends a count of reputation points for a user or show a leaderboard.',
  permissions: ['SEND_MESSAGES'],
  usage: '[<user>]',
  exec: async (args, message) => {
    try {
      // Create the initial embed.
      const embed = {
        color: blue,
        author: getAuthor(message.member)
      }

      // If a user isn't specified send the leaderboard.
      if (args.length < 1) {
        // Pull current thanks count from the database.
        const topReputation = await getTopThanks()

        // Create the initial embed.
        embed.title = `${repCoin ? `${repCoin} ` : ''}Top ${topReputation.length} Thanked Users`

        // Save the server.
        const guild = message.guild

        // Map the array of users to each be a string and join it with
        // a new line.
        embed.description = topReputation
          .map((user, i) => `${i + 1})  **${getName(guild.members.cache.find(m => m.id === user[0]))}** has ${user[1].length} reputation.`)
          .join('\n')
      } else {
        // Save the user object of the member to show reputation for.
        const member = message.mentions.members.first()

        // If the user doesn't exist send an error message and terminate the command.
        if (member === undefined) {
          return await sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
        }

        // Pull current thanks count from the database.
        const reputation = (await getThanks(member.user.id)).length

        // Create the initial embed.
        embed.title = `${repCoin ? `${repCoin} ` : ''}${getName(member)} has ${reputation} reputation.`
        embed.footer = {
          text: 'Use "thanks @user" to give someone rep!'
        }
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Reputation', 'Failed to delete message', err, message)
      }

      try {
        // Send the embed.
        return await message.channel.send({ embed })
      } catch (err) {
        await logError('Reputation', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('Reputation', 'Failed to run command', err, message)
    }
  }
}
