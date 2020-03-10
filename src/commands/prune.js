/*
* Gabe Dunn 2018
* Command that prunes the last x messages from the channel.
* TODO: fix
*/

// Export an object with command info and the function to execute.
import { logError } from '../utils/log'

export const pruneCommand = {
  name: 'Prune',
  aliases: ['prune', 'purge'],
  category: 'utils',
  description: 'Removes specified number of messages from the channel.',
  permissions: ['MANAGE_MESSAGES'],
  usage: '[<messages>]',
  exec: async (args, message) => {
    try {
      // Save the amount arg. If it doesn't exist, default to 5.
      const amount = args.length > 0
        ? isNaN(parseInt(args[0]))
          ? 0
          : parseInt(args[0])
        : 5

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('Prune', 'Failed to delete message', err, message)
      }

      try {
        // Limit amount of messages to delete to 50.
        const actualAmount = amount > 50 ? 50 : amount

        // Fetch the last 'amount' of messages form the current channel.
        const messages = await message.channel.messages.fetch({ limit: actualAmount })

        try {
          // Delete all of the messages selected with the previous
          // command.
          // TEMP FIX: Itterate over messages and remove.
          messages.array().forEach(m => {
            m.delete()
          })
          // await messages.clear()
        } catch (err) {
          await logError('Prune', 'Failed to delete messages', err, message)
        }
      } catch (err) {
        await logError('Prune', 'Failed to fetch messages', err, message)
      }
    } catch (err) {
      await logError('Prune', 'Failed to run command', err, message)
    }
  }
}
