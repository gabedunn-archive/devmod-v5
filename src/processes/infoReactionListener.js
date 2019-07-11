/*
 * Gabe Dunn 2019
 * Functionality relating to listening for reactions on the info message and applying roles to users.
 */

import { getSetting } from '../db'
import { verifiedRole } from '../utils/config'

// Applied an action to either add a remove a role from a user based on the action provided.
const roleAction = async ({ client, guildId, messageId, userId, emojiName }, remove = false) => {
  // Retrieve the list of messages to listen to from the database.
  const infoMessageID = await getSetting('verify_message_id')

  // Save some details about the reaction event to constants.
  const guild = client.guilds.get(guildId)
  const member = guild.member(userId)
  const roles = guild.roles

  // Grab the verified role from the server.
  const role = roles.find(r => r.name === verifiedRole)

  // If the role exists, continue.
  if (role !== null) {
    // If the message ID is equal the info message ID, continue.
    if (infoMessageID === messageId) {
      // If the emoji is the right one, continue.
      if (emojiName === '✅') {
        // Add or remove the role.
        remove ? await member.removeRole(role) : await member.addRole(role)
      }
    }
  }
}

// Given some information about a reaction addition, pass the info to roleAction to decide whether to add the role or not.
const roleAdd = async (client, guildId, messageId, userId, emojiName) => {
  try {
    // Create a context object with all of the params to pass to roleAction.
    const context = {
      client,
      guildId,
      messageId,
      userId,
      emojiName
    }
    // Run the roleAction function with the context passed in.
    await roleAction(context)
  } catch (e) {
    console.log(`Failed to add role: ${e}`)
  }
}

// Given some information about a reaction removal, pass the info to roleAction to decide whether to remove the role or not.
const roleRm = async (client, guildId, messageId, userId, emojiName) => {
  try {
    // Create a context object with all of the params to pass to roleAction.
    const context = {
      client,
      guildId,
      messageId,
      userId,
      emojiName
    }
    // Run the roleAction function with the context passed in and remove set to true.
    await roleAction(context, true)
  } catch (e) {
    console.log(`Failed to remove role: ${e}`)
  }
}

// Given a client, add a listener for message reactions that calls the proper functions for role listening.
export const initInfoReactionListener = async client => {
  // Add a listener for all events ('raw' type).
  client.on('raw', async event => {
    try {
      // Save event data.
      const { d: data } = event
      // If the event type is a reaction addition, run the roleAdd function.
      if (event.t === 'MESSAGE_REACTION_ADD') {
        // noinspection JSUnresolvedVariable
        await roleAdd(
          client,
          data.guild_id,
          data.message_id,
          data.user_id,
          data.emoji.name
        )
        // Otherwise, if the type is a reaction removal, run the roleRm function.
      } else if (event.t === 'MESSAGE_REACTION_REMOVE') {
        // noinspection JSUnresolvedVariable
        await roleRm(
          client,
          data.guild_id,
          data.message_id,
          data.user_id,
          data.emoji.name
        )
      }
    } catch (e) {
      console.log(`Error handling reaction: ${e}`)
    }
  })
}
