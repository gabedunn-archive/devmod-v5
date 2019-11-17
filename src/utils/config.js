/*
 * Gabe Dunn 2019
 * File to compile and export configuration.
 */

import defaultConfig from './default.config'
import { existsSync, realpathSync } from 'fs'

const configFile = realpathSync('devmod.config.js')

let userConfig = existsSync(configFile)
  ? require(configFile)['default']
  : {}

export default {
  ...defaultConfig,
  ...userConfig,
  channels: {
    ...defaultConfig.channels,
    ...userConfig.channels
  },
  roles: {
    ...defaultConfig.roles,
    ...userConfig.roles
  }
}
