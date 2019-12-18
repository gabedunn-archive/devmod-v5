import https from 'https'

import { blue } from '../utils/colours'
import { logError } from '../utils/log'
import { getAuthor } from '../utils/user'

const mdn = query => new Promise((resolve, reject) => {
  https.get(
    `https://developer.mozilla.org/api/v1/${query}`,

    res => {
      const chunks = []

      res.on('data', chunk => chunks.push(chunk))

      res.on('end', () => {
        try {
          resolve(JSON.parse(chunks.join('')))
        } catch (error) {
          reject(error)
        }
      })
    }
  ).on('error', reject)
})

export const mdnCommand = {
  name: 'MDN',
  aliases: ['mdn'],
  category: 'utils',
  description: 'Searches MDN and returns the first result.',
  permissions: ['SEND_MESSAGES'],

  exec: async (args, message) => {
    const query = encodeURIComponent(args.join(' '))

    try {
      // Query the MDN search API
      const { documents } = await mdn(`search/en-US?q=${query}&highlight=false`)
      const [result] = documents

      try {
        // Remove the user's message.
        await message.delete()
      } catch (err) {
        await logError('MDN', 'Failed to delete message', err, message)
      }

      try {
        // Send the MDN result.
        // noinspection JSUnresolvedFunction
        return message.channel.send({
          embed: {
            title: result.title,
            color: blue,
            description:
`...${result.excerpt}...

[Search on MDN](https://developer.mozilla.org/en-US/search?q=${query})`,
            author: getAuthor(message.member),
            url: `https://developer.mozilla.org/en-US/${result.slug}`
          }
        })
      } catch (err) {
        await logError('MDN', 'Failed to send message', err, message)
      }
    } catch (err) {
      await logError('MDN', `Failed to search MDN for query "${query}"`, err, message)
    }
  }
}
