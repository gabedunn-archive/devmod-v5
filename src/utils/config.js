import { config } from 'dotenv'
import { join } from 'path'

config()

export const botToken = process.env.BOT_TOKEN
export const ownerID = process.env.OWNER_ID
export const prefix = process.env.PREFIX || '.'
export const msgDeleteTime = process.env.MSG_DELETE_TIME || 10
export const dbFile = join(
  __dirname,
  '..',
  '..',
  process.env.DB_FILE || 'devmod.db'
)
export const migrationDir = join(__dirname, '..', 'migrations')
export const autoBan = process.env.AUTOBAN || true
export const autoBanWarns = process.env.AUTOBAN_WARNS || 3
export const banMsgDelete = process.env.BAN_MSG_DELETE || 0
export const channels = {
  warn: process.env.CHANNEL_LOG_WARN || 'warnings',
  ban: process.env.CHANNEL_LOG_BAN || 'bans',
  report: process.env.CHANNEL_REPORT || 'reports',
  roles: process.env.CHANNEL_ROLES || 'roles'
}
export const mutedRole = process.env.MUTED_ROLE || 'muted'
export const pointEmoji = process.env.POINTS_EMOJI || 'boye'
export const statusInterval = process.env.STATUS_INTERVAL || 5
export const pointsTopCount = process.env.POINTS_TOP_COUNT || 10
