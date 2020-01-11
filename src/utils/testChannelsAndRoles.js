/*
 * Gabe Dunn 2019
 * Function to test that all the channels and roles specified in the config exist.
 */

import { logError } from './log'

const { channels, guildID, roles } = require('./config').default

export const testChannelsAndRoles = async client => {
  const guild = client.guilds.find(g => g.id === guildID)
  const guildChannels = guild.channels
  const guildRoles = guild.roles

  const nullChannels = Object.values(channels).map(c => {
    return {
      name: c,
      channel: guildChannels.find(gc => gc.name === c)
    }
  }
  ).filter(c => c.channel === null)

  const nullRoles = Object.values(roles).map(r => {
    return {
      name: r,
      role: guildRoles.find(gr => gr.name === r)
    }
  }
  ).filter(r => r.role === null)

  if (nullChannels.length !== 0) {
    await logError('Test CnR', `Channels Don't Exist: ${nullChannels.map(c => `${c.name}`).join(', ')}`, false)
  }
  if (nullRoles.length !== 0) {
    await logError('Test CnR', `Roles Don't Exist: ${nullRoles.map(c => `${c.name}`).join(', ')}`, false)
  }
  if (nullChannels.length !== 0 || nullRoles.length !== 0) {
    throw new Error('channels or roles don\'t exist.')
  }
}
