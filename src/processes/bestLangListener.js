/*
 * Alex Crocker <hello@crock.dev> 2020
 * Functionality relating to giving a random opinion on what the best programming language is at any given time.
 */

import { log, logError } from '../utils/log'
import { blue } from '../utils/colours'

const languages = [
  'javascript',
  'java',
  'c++',
  'c#',
  'c',
  'php',
  'python',
  'rust',
  'go',
  'cobol',
  'bash',
  'applescript',
  'perl'
]

export const initBestLangListener = async client => {
  try {
    // For each message run a function.
    client.on('message', async message => {
      try {
        // If the message isn't a dm, the author isn't a bot, and it contains the phrase 'the best language'
        if (message.channel.type !== 'dm' && !message.author.bot && ['best language', 'best programming language'].some(t => message.content.toLowerCase().includes(t))) {
          try {
            var randomLanguage = languages[Math.floor(Math.random() * languages.length)].toUpperCase()
            // Send a confirmation message.
            return message.channel.send({
              embed: {
                color: blue,
                description: `Devmod says the best programming language is **${randomLanguage}**!   :stuck_out_tongue:`
              }
            })
          } catch (err) {
            await logError('BestLangGag', 'Failed to send message', err)
          }
        }
      } catch (err) {
        await logError('BestLangGag', 'Failed to run listener', err)
      }
    })
    log('Init', 'BestLangGag listener initialized!')
  } catch (err) {
    // noinspection ES6MissingAwait
    logError('CommandListener', 'Failed to initialize the command listener', err)
  }
}
