/*
 * Gabe Dunn 2019
 * File to run to confirm database is working fine.
 */

import { setSetting, getSetting } from '../db'

// Main function to utilize await for db functions.
const test = async () => {
  // Set the value of key 'test' to something.
  await setSetting('test', 'hey you')

  // Retrieve the value of key 'test' and log it to confirm it is accurate.
  const val = await getSetting('test')

  console.log(val)
}

test()
