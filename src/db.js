const { Datastore } = require('nedb-async-await')

import { dbFile } from './utils/config'

const db = new Datastore({
  filename: dbFile,
  autoload: true
})

const defaultDBValues = {
  owner: 'RedXTech#3076',
  test: 'default value'
}

export const setSetting = async (key, value) => {
  try {
    await db.update({ key }, { key, value }, { upsert: true })
  } catch (err) {
    console.error(`setSetting: ${key}:${value}  Failed:`, err)
  }
}

export const getSetting = async key => {
  try {
    const setting = await db.findOne({ key })
    if (setting !== null && Object.entries(setting).length > 0 && setting.hasOwnProperty('value')) {
      return setting.value
    } else {
      return defaultDBValues[key]
    }
  } catch (err) {
    console.error(`getSetting: ${key} Failed:`, err)
  }
}
