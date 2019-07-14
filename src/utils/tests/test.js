/*
 * Gabe Dunn 2019
 * File to run to test various js methods and etc.
 */

// Main function to utilize await for db functions.
import { log } from '../log'

const test = async () => {
  const array = [
    {
      array: [1, 2, 3, 4]
    },
    {
      array: [5, 6, 7, 8]
    }
  ]
  const newArray = array.reduce((previousValue, currentValue) => {
    const previousArray = previousValue
    for (const item of currentValue.array) {
      previousArray.push(item)
    }
    return previousArray
  }, [])

  log('Test', newArray)
}

test()
