/*
 * Gabe Dunn 2019
 * Functionality relating to changing the bot's activity in the sidebar.
 */

import { activities } from './activities'
import { statusInterval } from './config'

// Changes the status of the bot to the specified activities on an interval based on the config value 'statusInterval'.
export const initActivityChanger = client => {
  // Set an interval to run a function every x minutes where statusInterval = x. (x mins * 60 secs * 1000 ms).
  setInterval(async () => {
    // Choose a random activity from the activities file.
    const activity = activities[Math.floor(Math.random() * activities.length)]

    // Set wait for the activity to be set.
    await client.user.setActivity(activity)

    // Set a timeout to switch the activity back to '.help' after 1 minute. (60 secs * 1000 ms).
    setTimeout(async () => {
      // Set the activity back to '.help'.
      await client.user.setActivity('.help')
    }, 60 * 1000)
  }, statusInterval * 60 * 1000)
}
