/*
* Gabe Dunn 2018
* Command that prunes the last x messages from the channel.
*/

// Export an object with command info and the function to execute.
export const pruneCommand = {
  name: 'Prune',
  aliases: ['prune', 'purge'],
  category: 'utils',
  description: 'Removes specified number of messages from the channel.',
  permissions: ['MANAGE_MESSAGES'],
  usage: 'prune [<messages>]',
  exec: async (args, message) => {
    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    // Save the amount arg. If it doesn't exist, default to 5.
    const amount = args.length > 0 ? parseInt(args[0]) : 5

    try {
      // Limit amount of messages to delete to 50.
      const actualAmount = amount > 50 ? 50 : amount

      // Fetch the last 'amount' of messages form the current channel.
      const messages = await message.channel.fetchMessages({ limit: actualAmount })

      // Delete all of the messages selected with the previous command.
      messages.deleteAll()
    } catch (err) {
      console.log('Error deleting messages:', err)
    }
  }
}
