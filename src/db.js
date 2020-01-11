/*
 * Gabe Dunn 2019
 * Contains all functions that interact with the database.
 */

import {
  Datastore
} from 'nedb-async-await'
import {
  logError
} from './utils/log'

const {
  dbFile
} = require('./utils/config').default

// Create and initialize the database using auto-loading and the configured filename.
const db = new Datastore({
  autoload: true,
  filename: dbFile
})

// Object containing default values to return if there isn't an entry in the database.
const defaultDBValues = {
  owner: 'RedXTech#3076',
  test: 'default value',
  reactions_message_ids: {},
  info_message_ids: []
}

// Given a key and a value, sets the 'key' document in the database to have a value of 'value'.
export const setSetting = async (key, value) => {
  try {
    // Update database entries with a key of 'key' with the new values. Upsert: create new document if one doesn't already exist.
    await db.update({
      key
    }, {
      key,
      value
    }, {
      upsert: true
    })
  } catch (err) {
    await logError('DB', `setSetting: ${key}:${value} failed`, err)
  }
}

// Returns the value in the database for the given key if it exists, otherwise returns the default value from defaultDBValues.
export const getSetting = async key => {
  try {
    // Search the database for any one document with a key of 'key' and save it to setting.
    const setting = await db.findOne({
      key
    })
    // If 'key' exists (setting !== null), setting has more than 0 entries, and has a value property return the value. Otherwise return the default value.
    if (setting !== null && Object.entries(setting).length > 0 && Object.prototype.hasOwnProperty.call(setting, 'value')) {
      return setting.value
    } else {
      return defaultDBValues[key]
    }
  } catch (err) {
    await logError('DB', `getSetting: ${key} failed`, err)
  }
}

// Given a user, reason, and staff member, pushes a warning into the database.
export const addWarning = async (user, reason, staff) => {
  try {
    // Create the warning object.
    const warning = {
      reason,
      staff,
      timestamp: new Date()
    }

    // Create the push object and add the warning to it.
    const $push = {}
    $push[user] = warning

    // Update the database by pushing the warning to the user.
    await db.update({
      key: 'warnings'
    }, {
      $push
    }, {
      upsert: true
    })
  } catch (err) {
    await logError('DB', 'addWarning failed', err)
  }
}

// Given a user, returns a list of warnings from the database.
export const getWarnings = async user => {
  try {
    // Pull the warnings from the database.
    const warnings = await db.findOne({
      key: 'warnings'
    })
    // If warnings isn't null, continue.
    if (warnings !== null) {
      // If warnings has the property 'user', return the property.
      if (Object.prototype.hasOwnProperty.call(warnings, user)) {
        return warnings[user]
      } else {
        return []
      }
    } else {
      return []
    }
  } catch (err) {
    await logError('DB', 'getWarning failed', err)
  }
}

// Given a user, removes all warnings from the database.
export const clearWarnings = async user => {
  try {
    // Set the set object to an empty array.
    const $set = {}
    $set[user] = []

    // Update the database by setting the user's warnings to an empty array.
    await db.update({
      key: 'warnings'
    }, {
      $set
    }, {
      upsert: true
    })
  } catch (err) {
    await logError('DB', 'clearWarning failed', err)
  }
}

// Given two users, add the second user to the list of thanks on the first.
export const incrementThanks = async (thankee, thanker) => {
  try {
    // Create the push object and add the thanker ID to it.
    const $push = {}
    $push[thankee] = thanker

    // Update the database by pushing the thanks to the user.
    await db.update({
      key: 'thanks'
    }, {
      $push
    }, {
      upsert: true
    })

    try {
      // Return the number of thanks.
      return (await getThanks(thankee)).length
    } catch (err) {
      await logError('DB', 'Failed to get number of thanks', err)
    }
  } catch (err) {
    await logError('DB', 'incrementThanks failed', err)
  }
}

// Given a user, returns a list of thanks from the database.
export const getThanks = async user => {
  try {
    // Pull the thanks from the database.
    const thanks = await db.findOne({
      key: 'thanks'
    })
    // If thanks isn't null, continue.
    if (thanks !== null) {
      // If thanks has the property 'user', return the property.
      if (Object.prototype.hasOwnProperty.call(thanks, user)) {
        return thanks[user]
      } else {
        return []
      }
    } else {
      return []
    }
  } catch (err) {
    await logError('DB', 'getThanks failed', err)
  }
}

// Returns the 10 most thanked users from the database.
export const getTopThanks = async () => {
  try {
    // Pull the thanks from the database.
    const thanks = await db.findOne({
      key: 'thanks'
    })
    // If thanks isn't null, continue.
    if (thanks !== null) {
      // Filter out database fields, sort by amount of thanks (length of thanks array), and take the first 10 elements.
      return [...Object.entries(thanks)]
        .filter(user => !['key', '_id'].includes(user[0]))
        .sort((a, b) => (a[1].length > b[1].length) ? -1 : ((b[1].length > a[1].length) ? 1 : 0))
        .slice(0, 10)
    } else {
      return []
    }
  } catch (err) {
    await logError('DB', 'getThanks failed', err)
  }
}
