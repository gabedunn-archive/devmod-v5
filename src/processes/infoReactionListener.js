/*
 * Gabe Dunn 2019
 * Functionality relating to listening for reactions on the info message and applying roles to users.
 */

import { getSetting } from '../db'
import { verifiedRole } from '../utils/config'
import { log, logError } from '../utils/log'

// Applied an action to either add a remove a role from a user based on the action provided.
const roleAction = async ({ client, guildId, messageId, userId, emojiName }, remove = false) => {
  try {
    // Retrieve the list of messages to listen to from the database.
    const infoMessageID = await getSetting('verify_message_id')

    // Save some details about the reaction event to constants.
    const guild = client.guilds.get(guildId)
    const member = guild.member(userId)
    const roles = guild.roles

    // Grab the verified role from the server.
    const role = roles.find(r => r.name === verifiedRole)

    try {
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
    } catch (err) {
      logError('InfoListener', 'Failed to run role command', err)
    }
  } catch (err) {
    logError('InfoListener', 'Failed to execute the role action', err)
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
  } catch (err) {
    logError('InfoListener', `Failed to add role: ${err}`)
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
  } catch (err) {
    logError('InfoListener', 'Failed to remove role', err)
  }
}

// Given a client, add a listener for message reactions that calls the proper functions for role listening.
export const initInfoReactionListener = async client => {
  try {
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
      } catch (err) {
        logError('InfoListener', 'Failed handling reaction', err)
      }
    })
    log('Init', 'Info reaction listener initialized!')
  } catch (err) {
    logError('InitListener', 'Failed to add raw listener', err)
  }
}
