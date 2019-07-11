/*
* Gabe Dunn 2018
* Command that warns a user.
*/

import { orange, red, yellow } from '../utils/colours'
import { sendErrorMessage } from '../utils/sendErrorMessage'
import { autoBan, autoBanWarns, banMsgDelete, channels } from '../utils/config'
import { addWarning, getWarnings } from '../db'
import { banCommand } from './ban'

// Export an object with command info and the function to execute.
export const warnCommand = {
  name: 'Warn',
  aliases: ['warn', 'addwarn'],
  category: 'moderation',
  description: 'Warns a user.',
  permissions: ['KICK_MEMBERS'],
  usage: 'warn <user> [<reason>]',
  exec: async (args, message) => {
    // If a user isn't specified send an error message and terminate the command.
    if (args.length < 1) {
      await message.react('❌')
      return sendErrorMessage('User Not Specified', 'You didn\'t specify a user to warn.', message)
    }

    // Save the user object of the member to be warned.
    // noinspection DuplicatedCode
    const member = message.mentions.members.first()

    // If the user doesn't exist send an error message and terminate the command.
    if (member === null) {
      await message.react('❌')
      return sendErrorMessage('Not a User', 'The user you specified either doesn\'t exist or isn\'t a user.', message)
    }

    // If the specified user is able to kick members (read: moderator) terminate the command.
    if (member.hasPermission('KICK_MEMBERS')) {
      await message.react('❌')
      return sendErrorMessage(
        'Can\'t Warn Member',
        'You are not allowed to warn that member.',
        message
      )
    }

    try {
      // Remove the user's message.
      await message.delete()
    } catch (err) {
      console.error('Failed to delete message:', err)
    }

    const reason = args.length > 1 ? args.slice(1).join(' ') : 'warned by devmod'

    // Save some information about the user.
    const user = member.user
    const name = member.nickname ? member.nickname : user.username

    // Save some info about the staff member.
    const staffMember = message.member
    const staffUser = staffMember.user
    const staffName = staffMember.nickname ? staffMember.nickname : staffUser.username

    // Pull current warnings from the database.
    const currentWarnings = await getWarnings(user.id)

    // Log the warning to the database.
    await addWarning(user.id, reason, staffUser.id)

    // Select the colour based on the number of previous warnings.
    const colour = currentWarnings.length < 1
      ? yellow
      : currentWarnings.length < 2
        ? orange
        : red

    // Log the warn to the current channel.
    // noinspection JSUnresolvedFunction
    await message.guild.channels
      .find(c => c.name === channels.warn)
      .send({
        embed: {
          color: colour,
          title: `Warning #${currentWarnings.length + 1}`,
          description: `${name} (${user.tag}) has been warned for: ${reason}.`,
          author: {
            name: `${staffName} (${staffUser.tag})`,
            icon_url: staffUser.avatarURL
          },
          timestamp: new Date()
        }
      })

    // Create a dm channel to the user.
    const dm = await user.createDM()

    // Send a dm to the user letting them know they've been warned.
    await dm.send({
      embed: {
        title: `You have received a warning on ${message.guild.name}.`,
        color: colour,
        thumbnail: {
          url: message.guild.iconURL
        },
        fields: [
          {
            name: 'Reason:',
            value: reason
          }
        ]
      }
    })

    // If autoban is enabled, see if the user should be banned.
    if (autoBan) {
      // If the number of warnings passes the specified threshold, ban the user.
      if (currentWarnings.length + 1 >= autoBanWarns) {
        // Run the ban command.
        await banCommand.exec([args[0], banMsgDelete, ...'Exceeded maximum warnings'.split(' ')], message)
      }
    }
  }
}
