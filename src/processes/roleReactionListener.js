/*
 * Gabe Dunn 2019
 * Functionality relating to listening for reactions on the roles message(s) and applying roles to users.
 */

import { allRoles } from '../utils/approvedRoles'
import { getSetting } from '../db'
import { logError } from '../utils/log'

// Applied an action to either add a remove a role from a user based on the action provided and the approved roles list.
const roleAction = async ({ client, guildId, messageId, userId, emojiName }, remove = false) => {
  try {
    // Retrieve the list of messages to listen to from the database.
    const reactionMessageIDs = await getSetting('reactions_message_ids')

    // Save some details about the reaction event to constants.
    const guild = client.guilds.get(guildId)
    const member = guild.member(userId)
    const roles = guild.roles

    // Run a function for each message ID in the list of reaction role messages.
    for (const key of Object.keys(reactionMessageIDs)) {
      // If the message ID is equal the ID from the loop, continue.
      if (reactionMessageIDs[key] === messageId) {
        // For each group of roles in the approved roles list, run a function.
        for (const roleGroup of allRoles) {
          // If the current key (from the message) is equal to a role group ID, continue.
          if (roleGroup.id === key) {
            // For each role in the current role group, run a function.
            for (const roleEntry of Object.keys(roleGroup.roles)) {
              // If the reaction emoji is equal to the emoji of the current role, continue.
              if (roleGroup.roles[roleEntry].emoji === emojiName) {
                // If the role exists, find the role and either add or remove the role from the user based on the params.
                if (roleGroup.roles[roleEntry] !== null && roleGroup.roles[roleEntry] !== undefined) {
                  // Find the role from the guild's list of roles.
                  const role = roles.find(r => r.name === roleEntry)
                  try {
                    // If remove is true, remove the role from the user. Otherwise, add the role to the user.
                    remove ? await member.removeRole(role) : await member.addRole(role)
                  } catch (err) {
                    logError('RoleListener', 'Failed to run role command', err)
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    logError('RoleListener', 'Failed to execute the role action', err)
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
    logError('RoleListener', 'Failed to add role', err)
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
    logError('RoleListener', 'Failed to remove role', err)
  }
}

// Given a client, add a listener for message reactions that calls the proper functions for role listening.
export const initReactionListener = async client => {
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
        logError('RoleListener', 'Failed to handle reaction', err)
      }
    })
  } catch (err) {
    logError('RoleListener', 'Failed to add raw listener', err)
  }
}
