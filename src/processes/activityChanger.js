/*
 * Gabe Dunn 2019
 * Functionality relating to changing the bot's activity in the sidebar.
 */

import { log, logError } from '../utils/log'

const { activities, prefix } = require('../utils/config').default

// Changes the status of the bot to the specified activities on an interval based on the config value 'statusInterval'.
export const initActivityChanger = async client => {
  // Initially set the status message to `${prefix}help`.
  try {
    await client.user.setActivity(`${prefix}help`)
  } catch (err) {
    await logError('Activity', `Failed to set activity to ${prefix}help:`, err)
  }
  // Set an interval to run a function every 5 minutes (5 mins * 60 secs * 1000 ms).
  setInterval(async () => {
    try {
      // Choose a random activity from the activities file.
      const activity = activities[Math.floor(Math.random() * activities.length)]

      // Wait for the activity to be set.
      await client.user.setActivity(activity)
    } catch (err) {
      await logError('Activity', 'Failed to set activity', err)
    }

    // Set a timeout to switch the activity back to '.help' after 1 minute. (60 secs * 1000 ms).
    setTimeout(async () => {
      try {
        // Set the activity back to '.help'.
        await client.user.setActivity(`${prefix}help`)
      } catch (err) {
        await logError('Activity', `Failed to set activity back to ${prefix}help:`, err)
      }
    }, 60 * 1000)
  }, 5 * 60 * 1000)
  log('Init', 'Activity changer initialized!')
}
