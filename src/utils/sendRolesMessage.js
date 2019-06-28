/*
 * Gabe Dunn 2019
 * Functionality relating to sending the roles message.
 */

import chalk from 'chalk'
import discord from 'discord.js'

import { blue } from './colours'
import { allRoles } from './approvedRoles'
import { botToken, channels } from './config'
import { getSetting, setSetting } from '../db'

export const sendRolesMessage = async () => {
  // Initiate the discord.js client.
  const client = new discord.Client()

  // Handler for client being 'ready'.
  client.on('ready', async () => {
    console.log(chalk.blue(`Logged in as ${client.user.tag}.`))

    // Save the array of guilds.
    const guildArray = client.guilds.array()

    // Test to make sure the bot has been added to at least one guild.
    if (guildArray.length === 0) {
      throw new Error('The bot hasn\'t been added to any servers yet.')
    }

    // Save the current guild.
    const guild = guildArray[0]

    // Save the previous roles messages.
    const previousRolesMessages = await getSetting('reactions_message_ids')

    // Save the roles channel.
    const rolesChannel = guild.channels.find(c => c.name === channels.roles)

    // If the roles channel exists, find and delete the previous messages.
    if (rolesChannel !== null) {
      // Delete the previous roles messages if they exist.
      for (const messageID of Object.values(previousRolesMessages)) {
        const message = await rolesChannel.fetchMessage(messageID)
        await message.delete()
      }
    }

    // Initialize empty variables.
    const messageIDs = {}
    let count = 0

    // For each group of roles in allRoles, send a message.
    for (const roleGroup of allRoles) {
      // Create an array, and for each approved role push a string with 'name: emoji' to it.
      const roleArray = []
      for (const role of Object.values(roleGroup.roles)) {
        roleArray.push(`${role.name}: ${role.emoji}`)
      }

      try {
        // Find the roles channel, send the roles message, and save the ID.
        // noinspection JSObjectNullOrUndefined
        const message = await rolesChannel.send({
          // Create the discord embed to send to the channel.
          embed: {
            title: roleGroup.name,
            color: blue,
            description: `${roleGroup.message}\n\n${roleArray.join('\n')}`
          }
        })

        // Save the message ID.
        messageIDs[roleGroup.id] = message.id

        // Add each reaction to the roles message.
        for (const reaction of Object.values(roleGroup.roles)) {
          // Wait for the reaction to be added.
          try {
            await message.react(reaction.emoji)
          } catch (err) {
            console.error('Failed to add reaction to roles message:', err)
          }
        }
      } catch (err) {
        console.error('Failed to send message to role channel:', err)
      }

      // Increment count, and if it's equal to the number of role groups, call the finish function with messageIDs.
      if (++count === allRoles.length) {
        await finish(client, messageIDs)
      }
    }
  })

  // Log the bot in.
  try {
    await client.login(botToken)
  } catch (err) {
    console.error('Failed to log bot in:', err)
  }
}

const finish = async (client, messageIDs) => {
  // Destroy the client.
  try {
    await client.destroy()
  } catch (err) {
    console.error('Failed to destroy the client:', err)
  }
  // Log the IDs to the console joined by ', '
  console.log(chalk.blue(`Role Message IDs: ${Object.values(messageIDs).join(', ')}.`))

  try {
    // Save the messageIDs to the database.
    await setSetting('reactions_message_ids', messageIDs)
    console.log(chalk.greenBright('Successfully sent roles message!'))
  } catch (err) {
    console.error('Error pushing messageIDs to database:', err)
  }
}
