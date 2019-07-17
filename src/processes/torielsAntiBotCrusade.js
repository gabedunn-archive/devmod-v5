/*
 * Gabe Dunn 2019
 * Process to catch spam bots. Adapted from https://gist.github.com/Dracovian/cb923c2b2fff7bad07ff7da4cdb6a3f8
 */

// Export a function to initialize the anti bot process.
import { orange } from '../utils/colours'
import { channels } from '../utils/config'
import { log, logError } from '../utils/log'

export const initTorielsAntiBotCrusade = async client => {
  try {
    // Make a list of spam bot urls.
    const spamBotUrls = [
      'privatepage.vip',
      'nakedphotos.club'
    ]

    // On each message check to see if it contains the link.
    client.on('message', async message => {
      try {
        // If the message is from a bot, a staff/trusted member, ignore it.
        if (!message.author.bot && !message.member.roles.some(role => ['Staff', 'MVP'].includes(role.name))) {
          // If the message content includes one of the spam bot urls.
          if (spamBotUrls.some(spam => message.content.includes(spam))) {
            try {
              // Send a message to the reports channel detailing the removal.
              await client.channels.find(c => c.name === channels.crusade).send({
                embed: {
                  color: orange,
                  author: {
                    name: `${client.user.username}'s (${client.user.tag})`,
                    icon_url: client.user.avatarURL
                  },
                  fields: [{
                    name: `**Deleted message from ${message.author.username}#${message.author.discriminator}** *(ID ${message.author.id})*`,
                    value: `**Message:** ${message.content}`,
                    inline: false
                  }]
                }
              })
              // Delete the message.
              await message.delete()
            } catch (err) {
              await logError('AntiBot', `Failed to delete spam message from ${message.author.username}`, err)
            }
          }
        }
      } catch (err) {
        await logError('AntiBot', 'Failed to handle the message', err)
      }
    })
    log('Init', 'Toriel\'s anti-bot crusade initialized!')
  } catch (err) {
    await logError('AntiBot', 'Failed to initialize the anti bot crusade', err)
  }
}
