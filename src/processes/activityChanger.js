/*
 * Gabe Dunn 2019
 * Functionality relating to changing the bot's activity in the sidebar.
 */

import { activities } from '../utils/activities'
import { prefix, statusInterval } from '../utils/config'

// Changes the status of the bot to the specified activities on an interval based on the config value 'statusInterval'.
export const initActivityChanger = async client => {
  // Initially set the status message to `${prefix}help`.
  try {
    await client.user.setActivity(`${prefix}help`)
  } catch (err) {
    console.error(`Failed to set activity back to ${prefix}help:`, err)
  }
  // Set an interval to run a function every x minutes where statusInterval = x. (x mins * 60 secs * 1000 ms).
  setInterval(async () => {
    // Choose a random activity from the activities file.
    const activity = activities[Math.floor(Math.random() * activities.length)]

    // Wait for the activity to be set.
    try {
      await client.user.setActivity(activity)
    } catch (err) {
      console.error('Failed to set activity:', err)
    }

    // Set a timeout to switch the activity back to '.help' after 1 minute. (60 secs * 1000 ms).
    setTimeout(async () => {
      // Set the activity back to '.help'.
      try {
        await client.user.setActivity(`${prefix}help`)
      } catch (err) {
        console.error(`Failed to set activity back to ${prefix}help:`, err)
      }
    }, 60 * 1000)
  }, statusInterval * 60 * 1000)
}
