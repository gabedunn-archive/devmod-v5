/*
* Gabe Dunn 2018
* Command that quotes and pings a user in the specified channel.
*/

import { orange } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { logError } from '../utils/log'
import { getAuthor, getName } from '../utils/user'

// Export an object with command info and the function to execute.
export const moveCommand = {
  name: 'Move',
  aliases: ['move'],
  category: 'moderation',
  description: 'Move\'s a user\'s message(s) to a different channel.',
  permissions: ['MANAGE_MESSAGES'],
  usage: '<user> <channel>',
  exec: async (args, message) => {
    try {
      // If there aren't any args, send an error message stating a member wasn't specified and terminate the command.
      if (args.length < 1) {
        return await sendErrorMessage('User Not Specified', 'You didn\'t specify a user to move.', message)
      }

      // Get the member tagged in the args.
      const memberTagged = message.mentions.members.first()

      // Check that the user is valid.
      if (memberTagged === undefined) {
        return await sendErrorMessage('User Not Valid', 'That user isn\'t a valid user.', message)
      }

      // Send error message.
      if (args.length < 2) {
        return await sendErrorMessage('Channel Not Specified', 'You didn\'t specify a channel to move the message to.', message)
      }

      // Save the args remaining after the first two. If there aren't more than two args, default to 'Banned by devmod.'.
      const channel = message.mentions.channels.first()

      // Check to make sure the specified channel exists.
      if (channel === undefined) {
        return await sendErrorMessage('Channel Not Valid', 'You didn\'t specify a valid channel.', message)
      }

      // Fetch the last 20 of messages form the current channel.
      const messages = await message.channel.messages.fetch({ limit: 20 })

      // Filter through the grabbed IDs for message by the tagged used and grab the most recent.
      const recentMessage = messages.filter(m => m.member.user.id === memberTagged.user.id).first()

      // It the most recent message doesn't exist, send an error message.
      if (recentMessage === undefined) {
        return await sendErrorMessage('User Not Found', 'That user hasn\'t sent a message recently.', message)
      }

      // Select the first 10 messages before the most recent message.
      const messagesBefore = await message.channel.messages.fetch({
        before: recentMessage.id,
        limit: 10
      })

      // Initialize the array of messages with the original message.
      const messagesToQuote = [recentMessage]

      // For each message before the original, if it is sent by the original member, add it to the messages to quote,
      // otherwise break the loop.
      for (const beforeMessage of messagesBefore) {
        if (beforeMessage[1].member.user.id === memberTagged.user.id) {
          messagesToQuote.push(beforeMessage[1])
        } else {
          break
        }
      }

      // Fetch all messages again.
      const messagesToDelete = await message.channel.messages.fetch({
        before: recentMessage.id,
        limit: messagesToQuote.length - 1
      })

      try {
        // Delete all of the users quoted messages.
        // BUG: Does not work
        await messagesToDelete.clear()
      } catch (err) {
        await logError('Move', 'Failed to delete quoted messages', err, message)
      }

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Move', 'Failed to delete message', err, message)
      }

      try {
        // Send the quoted message to the proper channel.
        // noinspection JSUnresolvedFunction
        return channel.send(memberTagged, {
          embed: {
            title: `Message${messagesToQuote.length === 1 ? '' : 's'} Moved`,
            color: orange,
            description: messagesToQuote.map(m => m.content).reverse().join('\n'),
            author: getAuthor(memberTagged),
            footer: {
              icon_url: message.member.user.avatarURL(),
              text: `${getName(message.member, message.member.id)} has moved your message${messagesToQuote.length === 1 ? '' : 's'} to the proper channel.`
            },
            timestamp: new Date()
          }
        })
      } catch (err) {
        await logError('Move', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('Move', 'Failed to run command', err, message)
    }
  }
}
