/*
 * Gabe Dunn 2019
 * Configuration files.
 */

import { join } from 'path'

export default {
  botToken: 'NTkzMTMwOTM0ODQ1NDQwMDA2.Xczq0A.9t0Oaf1uS0o_4ORcC5ZiAqIt8DE',
  msgDeleteTime: 40,
  dbFile: join(__dirname, 'devmod.db'),
  channels: {
    warn: 'mod-log',
    ban: 'mod-log',
    reports: 'reports',
    roles: 'get-a-role',
    info: 'rules-and-information',
    crusade: 'mod-log',
    errors: 'errors'
  }
}
