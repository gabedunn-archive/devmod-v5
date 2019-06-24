import { allRoles } from '../utils/approvedRoles'

const roleAction = async ({ client, guildId, messageId, userId, emojiName }, remove = false) => {
  const db = new Database(dbFile)
  const reactions = db.prepare(
    'SELECT * FROM `settings` WHERE `key` = ? LIMIT 1'
  )

  for (const row of reactions.iterate('reaction_message_ids')) {
    const guild = client.guilds.get(guildId)
    const member = guild.member(userId)
    const roles = guild.roles
    const messageIDs = JSON.parse(row.value)

    if (!messageIDs.includes(messageId)) continue

    for (const reaction of Object.keys(allRolesMap)) {
      const react = allRolesMap[reaction]

      if (emojiName !== react.emoji) continue
      const role = roles.find(r => r.name === reaction)
      if (role !== null) {
        remove ? await member.removeRole(role) : await member.addRole(role)
      }
    }
  }
}
