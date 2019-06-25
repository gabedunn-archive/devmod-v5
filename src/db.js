/*
 * Gabe Dunn 2019
 * Contains all functions that interact with the database.
 */

import { Datastore } from 'nedb-async-await'
import { dbFile } from './utils/config'

// Create and initialize the database using auto-loading and the configured filename.
const db = new Datastore({
  autoload: true,
  filename: dbFile
})

// Object containing default values to return if there isn't an entry in the database.
const defaultDBValues = {
  owner: 'RedXTech#3076',
  test: 'default value'
}

// Given a key and a value, sets the 'key' document in the database to have a value of 'value'.
export const setSetting = async (key, value) => {
  try {
    // Update database entries with a key of 'key' with the new values. Upsert: create new document if one doesn't already exist.
    await db.update({ key }, { key, value }, { upsert: true })
  } catch (err) {
    console.error(`setSetting: ${key}:${value}  Failed:`, err)
  }
}

// Returns the value in the database for the given key if it exists, otherwise returns the default value from defaultDBValues.
export const getSetting = async key => {
  try {
    // Search the database for any one document with a key of 'key' and save it to setting.
    const setting = await db.findOne({ key })
    // If 'key' exists (setting !== null), setting has more than 0 entries, and has a value property return the value. Otherwise return the default value.
    if (setting !== null && Object.entries(setting).length > 0 && setting.hasOwnProperty('value')) {
      return setting.value
    } else {
      return defaultDBValues[key]
    }
  } catch (err) {
    console.error(`getSetting: ${key} Failed:`, err)
  }
}
