import { join } from 'path'

export default {
  botToken: undefined, // Discord API token for the bot.
  prefix: '.', // Prefix for bot commands.
  msgDeleteTime: 30, // Amount of time in seconds to wait before deleting large help messages.
  // dbFile: join(__dirname, '..', '..', 'devmod.db'), // Absolute path for the database file.
  dbFile: join(__dirname, 'devmod.db'), // Absolute path for the database file.
  autoBan: true, // Whether or not to enforce auto-banning after a specified number of warnings.
  autoBanWarns: 3, // Amount of warnings to warrant an auto-ban if enabled.
  banMsgDelete: 0, // Amount of warnings to warrant an auto-ban if enabled.
  channels: {
    warn: 'warnings', // Channel to forward all warning confirmation messages.
    ban: 'bans', // Channel to forward all ban confirmation messages.
    reports: 'reports', // Channel to forward all user report messages.
    roles: 'roles', // Channel to send and listen to reactions for roles.
    info: 'info', // Channel to send the info to.
    crusade: 'crusade', // Channel to send notifications that the anti bot crusade has deleted a message.
    errors: 'errors' // Channel to log errors to.
  },
  roles: {
    muted: 'muted', // Name of the role to apply to muted users.
    verified: 'verified' // Name of the role to apply to verified users.
  },
  activities: [
    'Counting your good boye points (rip)...',
    'Trying to unban SWAT SEAL...',
    'Spamming the DMs of a random user...',
    'Compiling...',
    'Having a snack.',
    'uncaughtException',
    'Shitposting in #offtopic.',
    'Admiring egg.',
    'Trying to exit vim...',
    'BEING A HUMAN.',
    '10011001101111100000011011110',
    'Hacking the FBI...',
    'Serving NaN users.',
    'on a Christian Server.',
    'et ur brokli',
    'this chat gets weird fasy',
    'https://i.imgur.com/BVRHZzg.png',
    'Complaining about the logo.',
    'REEEEEEEEEEEEEEEEEEEEEE',
    'Promoting VUE!'
  ],
  tags: [],
  approvedRoles: [],
}
